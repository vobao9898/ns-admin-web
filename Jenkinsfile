pipeline {
	agent {
		docker {
		args '''
		-u jenkins:jenkins
		-v /var/lib/jenkins/project:/var/lib/jenkins/project
		-v /var/lib/jenkins/project/pipeline/hpadmin/dev/cache/yarn:/home/jenkins/.cache
		-v /var/lib/jenkins/project/pipeline/hpadmin/dev/cache/npm:/home/jenkins/.npm'''
		image 'harrylehuu/levinci_node:14.17'
		}
	}
	stages {
        stage('Get Atuhor') {
            steps {
                script {
                    env.GIT_COMMIT_MSG = sh (returnStdout: true, script: 'git log -1 --pretty=%B').trim()
                    env.GIT_AUTHOR = sh (script: 'git log -1 --pretty=%cn ${GIT_COMMIT}', returnStdout: true).trim()
                }
            }
        }
		stage('Package Install') {
			steps {
				sh '''echo "NODE_OPTIONS=--max-old-space-size=4096" >> ~/.bash_profile
				. ~/.bash_profile
				yarn install --ignore-engines'''
			}
		}
		stage('Build for dev branch') {
			when {
				branch 'dev'
			}
			steps {
				sh '''echo "NODE_OPTIONS=--max-old-space-size=4096" >> ~/.bash_profile
				. ~/.bash_profile
				CI=false npm run build:dev
				cd build
				tar -cvf ${program_filename}.tar .
				mv ${program_filename}.tar ${WORKSPACE}'''
			}
		}
		stage('Build for staging branch') {
			when {
				branch 'staging'
			}
			steps {
				sh '''echo "NODE_OPTIONS=--max-old-space-size=4096" >> ~/.bash_profile
				. ~/.bash_profile
				CI=false npm run build:staging
				cd build
				tar -cvf ${program_filename}.tar .
				mv ${program_filename}.tar ${WORKSPACE}'''
			}
		}
		stage('Build for production branch') {
			when {
				branch 'production'
			}
			steps {
				sh '''echo "NODE_OPTIONS=--max-old-space-size=4096" >> ~/.bash_profile
				. ~/.bash_profile
				CI=false npm run build:prod
				cd build
				tar -cvf ${program_filename}.tar .
				mv ${program_filename}.tar ${WORKSPACE}'''
			}
		}
		stage('Deployment to Dev') {
			when {
				branch 'dev'
			}
			steps {
				sshPublisher(publishers: [sshPublisherDesc(configName: 'hpadmindev', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '''set -xe
				program_filename=hpadmin
				origin_path=/home/hpadmin/target/
				app_path=/home/hpadmin/web/staging.admin.harmonypayment.com/public_html/build/
				#Source file
				origin_filename=${origin_path}${program_filename}.tar
				#Unzip file
				tar -xvf ${origin_filename} -C ${app_path}
				#After copying, delete the source file
				if [ -f "${origin_filename}" ];then
					rm -f ${origin_filename}
					echo "${origin_filename} delete success"
				fi
				#Write the code for your startup program.
				echo "completed"''', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'hpadmin.tar')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true)])
			}
		}
		stage('Deployment to staging') {
			when {
				branch 'staging'
			}
			steps {
				sshPublisher(publishers: [sshPublisherDesc(configName: 'hpstagingadmin', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '''set -xe
				program_filename=hpadmin
				origin_path=/home/harmony_stage/target/
				app_path=/home/harmony_stage/frontend/build/
				#Source file
				origin_filename=${origin_path}${program_filename}.tar
				#Unzip file
				tar -xvf ${origin_filename} -C ${app_path}
				#After copying, delete the source file
				if [ -f "${origin_filename}" ];then
					rm -f ${origin_filename}
					echo "${origin_filename} delete success"
				fi
				#Write the code for your startup program.
				echo "completed"''', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'hpadmin.tar')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true)])
			}
		}
		stage('Deloy to HP Admin production') {
			when {
					branch 'production'
			}
			stages {
				stage('approve to deploy HP Admin production') {
					options {
						timeout(time: 180, unit: "SECONDS")
					}

					steps {
						input 'Click Process if you want to deploy!'
					}
				}
				stage('deploy to HP Admin production') {
					steps {
						sshPublisher(publishers: [sshPublisherDesc(configName: 'harmony-new-admin', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '''set -xe
							program_filename=hpadmin
							origin_path=/home/harmony/target/
							app_path=/home/harmony/admin/admin_new/admin/
							#Source file
							origin_filename=${origin_path}${program_filename}.tar
							#Unzip file
							tar -xvf ${origin_filename} -C ${app_path}
							#After copying, delete the source file
							if [ -f "${origin_filename}" ];then 
								rm -f ${origin_filename}
								echo "${origin_filename} delete success"
							fi
							#Write the code for your startup program.
							echo "completed"''', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'hpadmin.tar')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true)])
					}
				}
			}
		}
	}
	environment {
		program_filename = 'hpadmin'
		BUILD_TRIGGER_BY = "${currentBuild.getBuildCauses()[0].shortDescription} / ${currentBuild.getBuildCauses()[0].userId}"
	}
	post {
		success {
			script {
				slackSend channel: 'hau_admin', color: '#00FF00', message: "Hi\n Jenkins Notification\n\n Manually deploy by:  ${BUILD_TRIGGER_BY}\n Status Deploy Job:  ${currentBuild.result}\n\n Project Name:  ${env.JOB_NAME.replaceFirst('/.*', '')}              Build Number:  #${env.BUILD_NUMBER}                Branch Name:  ${env.BRANCH_NAME}\n Comitted by:  ${env.GIT_AUTHOR}\n Last commit message:  ${env.GIT_COMMIT_MSG}\n\n Commit Code: ${GIT_COMMIT}\n Commit URL: https://github.com/Levinci-Harmony/${env.JOB_NAME.replaceFirst('/.*', '')}/commit/${GIT_COMMIT}\n\n Deploy URL:  ${env.BUILD_URL}\n\n Design by Harry Le", teamDomain: 'levinci', tokenCredentialId: 'slack'
			}
		}
		failure {
			script {
				slackSend channel: 'hau_admin', color: '#FF0000', message: "Hi\n Jenkins Notification\n\n Manually deploy by:  ${BUILD_TRIGGER_BY}\n Status Deploy Job:  ${currentBuild.result}\n\n Project Name:  ${env.JOB_NAME.replaceFirst('/.*', '')}              Build Number:  #${env.BUILD_NUMBER}                Branch Name:  ${env.BRANCH_NAME}\n Comitted by:  ${env.GIT_AUTHOR}\n Last commit message:  ${env.GIT_COMMIT_MSG}\n\n Commit Code: ${GIT_COMMIT}\n Commit URL: https://github.com/Levinci-Harmony/${env.JOB_NAME.replaceFirst('/.*', '')}/commit/${GIT_COMMIT}\n\n Deploy URL:  ${env.BUILD_URL}\n\n Design by Harry Le", teamDomain: 'levinci', tokenCredentialId: 'slack'
			}
		}
		aborted {
			script {
				slackSend channel: 'hau_admin', color: '#000000', message: "Hi\n Jenkins Notification\n\n Manually deploy by:  ${BUILD_TRIGGER_BY}\n Status Deploy Job:  ${currentBuild.result}\n\n Project Name:  ${env.JOB_NAME.replaceFirst('/.*', '')}              Build Number:  #${env.BUILD_NUMBER}                Branch Name:  ${env.BRANCH_NAME}\n Comitted by:  ${env.GIT_AUTHOR}\n Last commit message:  ${env.GIT_COMMIT_MSG}\n\n Commit Code: ${GIT_COMMIT}\n Commit URL: https://github.com/Levinci-Harmony/${env.JOB_NAME.replaceFirst('/.*', '')}/commit/${GIT_COMMIT}\n\n Deploy URL:  ${env.BUILD_URL}\n\n Design by Harry Le", teamDomain: 'levinci', tokenCredentialId: 'slack'
			}
		}
		unstable {
			script {
				slackSend channel: 'hau_admin', color: '#FFFF33', message: "Hi\n Jenkins Notification\n\n Manually deploy by:  ${BUILD_TRIGGER_BY}\n Status Deploy Job:  ${currentBuild.result}\n\n Project Name:  ${env.JOB_NAME.replaceFirst('/.*', '')}              Build Number:  #${env.BUILD_NUMBER}                Branch Name:  ${env.BRANCH_NAME}\n Comitted by:  ${env.GIT_AUTHOR}\n Last commit message:  ${env.GIT_COMMIT_MSG}\n\n Commit Code: ${GIT_COMMIT}\n Commit URL: https://github.com/Levinci-Harmony/${env.JOB_NAME.replaceFirst('/.*', '')}/commit/${GIT_COMMIT}\n\n Deploy URL:  ${env.BUILD_URL}\n\n Design by Harry Le", teamDomain: 'levinci', tokenCredentialId: 'slack'
			}
		}
    }
}
