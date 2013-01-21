require "bundler/setup"
require "rake/packagetask"
require "highline/import"
require "json"

verbose(true)

task :package => :version

package = Rake::PackageTask.new("jquery.flexselect", :noversion) do |p|
  p.need_zip = true
  p.package_files.include("*.js", "*.css", "*.html", "README.*")
end

task :version do
  package.version = JSON.parse(File.read("flexselect.jquery.json"))["version"]
end

file package.package_dir_path do
  input = "jquery.flexselect.js"
  output = "#{package.package_dir_path}/#{input}"
  rm_f output
  sh("sed -e 's/%RELEASE_VERSION%/#{package.version}/g' -e 's/%RELEASE_DATE%/#{Date.today}/g' #{input} > #{output}")
end

desc "Publish a release to the wild"
task :publish do
  sh "git checkout gh-pages"
  sh "git merge master"
  sh "git push"
  sh "git checkout master"
  sh "git push"
  sh "git push --tags"
end

desc "Construct a new release package, and optionally tag the repository"
task :release => [:rewrite_docs, :repackage] do
  sh("git tag 'v#{package.version}'")
  puts("\n *** Don't forget to push the zip file to S3 ***")
  puts("\n *** Don't forget to `rake publish` ***")
end

desc "Rewrite the downlaod location in the docs"
task :rewrite_docs => :version do
  docs = IO.read("index.html")
  docs.sub!(/(download_url = .+)-\d+\.\d+\.\d+.zip/, "\\1-#{package.version}.zip")
  File.open("index.html", 'w') do |f|
    f.write docs
  end
  sh "git add index.html"
  sh "git add flexselect.jquery.json"
  sh "git commit -m 'Bumped to v#{package.version}'"
end
