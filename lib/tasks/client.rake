namespace :client do
  desc "Builds Loomio javascript client"
  task :build do
    puts "Building clientside assets..."
    run_commands(
      "cd client && npm install && cd ..",
      "cd client && node_modules/gulp/bin/gulp.js compile && cd ..",
      "rm -rf public/client/#{Loomio::Version.current}",
      "mv public/client/development public/client/#{Loomio::Version.current}")
  end
end
