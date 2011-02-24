require "bundler/setup"
require "rake/packagetask"
require "highline/import"

verbose(true)

task :package => :version

package = Rake::PackageTask.new("jquery.flexselect", :noversion) do |p|
  p.need_zip = true
  p.package_files.include("*.js", "*.css", "*.html", "README.*")
end

task :version do
  package.version = ask("What version?")
end

file package.package_dir_path do
  input = "jquery.flexselect.js"
  output = "#{package.package_dir_path}/#{input}"
  rm_f output
  sh("sed -e 's/%RELEASE_VERSION%/#{package.version}/g' -e 's/%RELEASE_DATE%/#{Date.today}/g' #{input} > #{output}")
end

desc "Publish a release to the wild"
task :publish do
  sh("git rebase master gh-pages")
  sh("git checkout master")
  sh("git push")
  sh("git push --tags")
end

desc "Construct a new release package, and optionally tag the repository"
task :release => :repackage do
  if agree("Create a tag?", true)
    sh("git tag 'v#{package.version}'")
    puts("\n *** Don't forget to `rake publish` ***")
  end
end
