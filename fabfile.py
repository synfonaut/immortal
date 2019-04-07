from fabric.api import run, env, cd, local

env.hosts = ["immutable.bit.sv"]
env.use_ssh_config = True

def gdeploy():
    local("git push");
    deploy()

def deploy():
    deploy_dir = "/home/immutable/"
    with cd(deploy_dir):
        run("git pull")
        run("./change_permissions.sh")

