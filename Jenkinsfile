pipeline {
  agent any

  tools {nodejs "nodejs"}

  stages {
    stage('Checkout SCM') {
      git branch: 'master', url: 'https://github.com/bekamais/reviews-interaction-app.git'
    }

    stage('Install node modules') {
      sh "npm install"
    }

    stage('Test') {
      sh "npm run build --prod"
    }

    stage('build') {
      sh "npm run build --prod"
    }
  }
}
