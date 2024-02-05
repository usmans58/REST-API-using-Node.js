provider "aws" {
  region = "eu-north-1"
}

resource "tls_private_key" "ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}
resource "aws_key_pair" "ssh_key" {
  key_name   = "rest_api_key"
  public_key = tls_private_key.ssh_key.public_key_openssh

  provisioner "local-exec" {
    command = <<-EOT
            echo "${tls_private_key.ssh_key.private_key_pem}" > rest_api_key.pem
        EOT
  }
}

variable "ingress_rules" {
  type    = list(number)
  default = [22, 80, 443, 3000]
}
variable "egress_rules" {
  type    = list(number)
  default = [0, 80, 443, 3000]
}


resource "aws_ecr_repository" "rest_api_repository" {
  name = "rest-api-image"
}

resource "null_resource" "push_image_to_ecr" {
  depends_on = [aws_ecr_repository.rest_api_repository]
  triggers = {
    image_id = "953575840513.dkr.ecr.eu-north-1.amazonaws.com/rest-api-image:latest"
  }
  provisioner "local-exec" {
    command = <<-EOT
            aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin ${aws_ecr_repository.rest_api_repository.repository_url}
            docker tag 953575840513.dkr.ecr.eu-north-1.amazonaws.com/rest-api-image:latest ${aws_ecr_repository.rest_api_repository.repository_url}:latest
            docker push ${aws_ecr_repository.rest_api_repository.repository_url}:latest
        EOT
  }
}

resource "aws_security_group" "ec2_security_groups" {
  name        = "rest_api_security_group"
  description = "Security group for rest api instance"

  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "TCP"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
  dynamic "egress" {
    for_each = var.egress_rules
    content {
      from_port   = egress.value
      to_port     = egress.value
      protocol    = "TCP"
      cidr_blocks = ["0.0.0.0/0"]

    }
  }

}
resource "aws_instance" "rest_api_instance" {
  ami           = "ami-0014ce3e52359afbd"
  instance_type = "t3.micro"
  key_name = aws_key_pair.ssh_key.key_name
  security_groups = [aws_security_group.ec2_security_groups.name]

  user_data=file("ec2_setup.sh")
}

