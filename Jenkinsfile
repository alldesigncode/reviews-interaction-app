pipeline {
  agent any

  tools {nodejs "nodejs"}

  stages {
    stage('Checkout SCM') {
      steps {
        git branch: 'master', url: 'https://github.com/bekamais/reviews-interaction-app.git'
      }
    }

    stage('Install node modules') {
      steps {
        sh "npm install"
      }
    }

    stage('Test') {
      steps {
        sh "npm run test:prod"
      }
    }
  }
}
