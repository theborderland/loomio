# DEPLOYING LOOMIO
# To run a full deploy simply run
# `rake deploy`
#
# This will push the current master branch to production.
# You can also specify the heroku remote, and the branch to be deployed, like so:
# `rake deploy <remote> <branch>`
#
# So, running `rake deploy loomio-clone test-feature` will deploy the test-feature branch
# to the heroku remote named loomio-clone
#
# This script is also modular, meaning you can run any part of it individually.
# The order of operations goes:
#
# rake deploy:bump_version    -- add a commit to master which bumps the current version
# rake deploy:plugins:fetch   -- fetch plugins from the loomio_org plugins.yml
# rake deploy:plugins:install -- install plugins so the correct files are built and deployed
# rake deploy:commit          -- commit all non-repository code to a branch for pushing
# rake deploy:push            -- push deploy branch to heroku
# rake deploy:cleanup         -- run rake db:migrate on heroku, restart dynos, and notify clients of version update

# Once per machine, you'll need to run a command to setup heroku
# rake deploy:setup           -- login to heroku and ensure heroku remote is present

def deploy_steps
  [
    "deploy:bump_version",
    "plugins:fetch[#{heroku_plugin_set}]",
    "plugins:install[fetched]",
    "client:build",
    "deploy:commit",
    "deploy:push",
    "deploy:cleanup"
  ].join(' ')
end

namespace :deploy do
  desc "Setup heroku and github for deployment"
  task :setup do
    remote = ARGV[1] || 'loomio-production'
    run_commands [
      "sh script/heroku_login.sh $DEPLOY_EMAIL $DEPLOY_PASSWORD",                     # login to heroku
      "echo \"Host heroku.com\n  StrictHostKeyChecking no\" > ~/.ssh/config",         # don't prompt for confirmation of heroku.com host
      "git config user.email $DEPLOY_EMAIL && git config user.name $DEPLOY_NAME",     # setup git commit user
      "git remote add #{remote} https://git.heroku.com/#{remote}.git"                 # add https heroku remote
    ]
  end

  desc "Commits built assets to deployment branch"
  task :commit do
    puts "Committing assets to deployment branch..."
    run_commands(
      "git checkout -b #{deploy_branch}",
      "rm -rf plugins/fetched/**/.git",
      "find plugins/fetched -name '*.*' | xargs git add -f",
      "find public/img/emojis -name '*.png' | xargs git add -f",
      "git add -f plugins",
      "git add public/client/#{loomio_version} -f",
      "git add public/service-worker.js -f",
      "git commit -m 'Add compiled assets / plugin code'",
      "git checkout master")
  end

  desc "Push to heroku!"
  task :push, [:remote,:branch,:id] do |t, args|
    raise 'remote must be specified' unless remote = args[:remote]
    raise 'branch must be specified' unless branch = args[:branch]
    raise 'deploy branch id must be specified' unless id = args[:id]

    puts "Deploying #{build_branch(remote, branch, id)} to heroku remote #{remote}"
    run_commands [
      "git push #{remote} #{build_branch(remote, branch, id)}:master -f",                 # DEPLOY!
    ]
  end

  desc "Migrate heroku database and restart dynos"
  task :cleanup do
    puts "Migrating heroku..."
    run_commands(
      "#{heroku_cli} run rake db:migrate -a #{heroku_remote}")
  end
end

def build_branch(remote, branch, id)
  "deploy-#{remote}-#{branch}-#{id}"
end

def run_commands(commands)
  commands.compact.each do |command|
    puts "\n-> #{command}"
    return false unless system(command)
  end
end