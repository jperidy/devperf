pipeline {
	agent any
	environment {
		dockerHome = tool 'myDocker'
		nodeHome = tool 'myNodeJS'
		PATH = "$dockerHome/bin:$nodeHome/bin:$PATH"
		CI = 'true'
	}
	stages {
		stage('Checkout') {
			steps {
				sh 'node --version'
				sh 'npm --version'
				sh 'docker version'
				echo "Build"
				echo "PATH - $PATH"
				echo "BUILD_NUMBER - $env.BUILD_NUMBER"
				echo "BUILD_ID - $env.BUILD_ID"
				echo "JOB_NAME - $env.JOB_NAME"
				echo "BUILD_TAG - $env.BUILD_TAG"
				echo "BUILD_URL - $env.BUILD_URL"
			}
		}
		stage('Install npm packages') {
			steps {
				sh "npm install"
				sh "npm install --prefix frontend/"
			}
		}
		stage('Test') {
			steps {
				sh "npm run test --prefix frontend/"
			}
		}
		stage('Build Docker Image DEMO') {
			steps {
				script {
					dockerImage = docker.build("jbperidy/ressource-management-app-demo:RELEASE-0.0.${env.BUILD_NUMBER}")
				}
			}
		}
		stage('Push Docker Image DEMO') {
			steps {
				script {
					docker.withRegistry('', 'dockerhub') {
						dockerImage.push();
						dockerImage.push('latest');
					}
				}
			}
		}
		stage('Build Docker Image POC OVH') {
			steps {
				script {
					dockerImage = docker.build("jbperidy/ressource-management-app-poc-ovh:RELEASE-0.0.${env.BUILD_NUMBER}")
				}
			}
		}
		stage('Push Docker Image POC OVH') {
			steps {
				script {
					docker.withRegistry('', 'dockerhub') {
						dockerImage.push();
						dockerImage.push('latest');
					}
				}
			}
		}
	} 
	
	post {
		always {
			echo 'I m awesone, I run always'
		} 
		success {
			echo 'I run when you are successful'
		}
		failure {
			echo 'I run when you faile'
		}
	}
}