pipeline {
    agent any

    environment {
        // Environment variables for BE-Express and BE-NestJS
        DB_HOST = 'localhost'
        DB_PORT = '5432'
        DB_USER = 'root'
        DB_PASSWORD = 'admin123'
        DB_NAME = 'db_food_order'

    }

    stages {
        stage('Install Dependencies') {
            parallel {
                stage('Install BE-Express') {
                    steps {
                        dir('BE-Express') {
                            bat 'npm install'
                        }
                    }
                } 
            }
        }
        
        stage('Build') {
            parallel {
                stage('Build BE-Express') {
                    steps {
                        dir('BE-Express') {
                            bat 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Start Applications') {
            parallel {
                stage('Start BE-Express') {
                    steps {
                        dir('BE-Express') {
                            bat 'start /B npm start'
                        }
                    }
                }
            }
        }
    }
}
