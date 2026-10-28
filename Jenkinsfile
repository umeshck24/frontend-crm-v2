node {

    genericReleasedBuild([
            projectName: "frontend-crm-v2",
            namespacePrefix: "kredit",
            deploymentName: "frontend-crm-v2",
            supportedDeployEnvs: ["develop", "staging", "production"],
            applicationModule: "frontend-crm-v2",
            jobModules: [],
            deploy             : [
                    develop   : [
                            request_cpu: "10m",
                            request_mem: "50M",
                            limit_cpu  : "1000m",
                            limit_mem  : "2Gi",
                    ],
                    staging   : [
                            request_cpu: "10m",
                            request_mem: "50M",
                            limit_cpu  : "1000m",
                            limit_mem  : "2Gi",
                    ],
                    production: [
                            request_cpu: "50m",
                            request_mem: "500M",
                            limit_cpu  : "2000m",
                            limit_mem  : "2Gi",
                    ]
            ]
    ]) {

		dockerBuild = { BuildArgs buildArgs, DeploymentArgs deployArgs ->
		    def tags = " -t ${buildArgs.imagePrefix}/${buildArgs.applicationModule}:${buildArgs.version}  -t ${buildArgs.imagePrefix}/${buildArgs.applicationModule}:latest --build-arg CUSTOM_ENVIRONMENT=${buildArgs.buildName} --build-arg BUILD_VERSION=${buildArgs.version} --build-arg SENTRY_AUTH_TOKEN=${env.SENTRY_AUTH_TOKEN} "
            sh "docker build ${tags} --build-arg jar_module=${buildArgs.applicationModule} --build-arg build_dir=${buildArgs.targetDir} ."
		}

        test = { BuildArgs buildArgs, DeploymentArgs deployArgs ->
            def imageName = "${buildArgs.imagePrefix}/${buildArgs.applicationModule}-tests:${buildArgs.version}"
            def tags = " -t ${imageName} --build-arg CUSTOM_ENVIRONMENT=${buildArgs.buildName} --build-arg BUILD_VERSION=${buildArgs.version} "
            sh "docker build ${tags} --build-arg jar_module=${buildArgs.applicationModule} --build-arg build_dir=${buildArgs.targetDir} -f Dockerfile-Test ."
            sh "docker run --rm ${imageName}"
        }
    }
}
