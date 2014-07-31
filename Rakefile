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

jquery_package = JSON.parse(File.read("flexselect.jquery.json"))

task :version do
  package.version = jquery_package["version"]
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
task :release => [:rewrite_docs, :rewrite_bower, :commit, :repackage] do
  sh("git tag 'v#{package.version}'")
  puts("\n *** Don't forget to push the zip file to S3 ***")
  puts("\n *** Don't forget to `rake publish` ***")
end

desc "Rewrite the downlaod location in the docs"
task :rewrite_docs => :version do
  docs = IO.read("index.html")
  docs.sub!(/(download_url = .+)-\d+\.\d+\.\d+.zip/, "\\1-#{package.version}.zip")
  File.open("index.html", "w") { |f| f.write docs }
end

desc "Rewrite the bower package manifest"
task :rewrite_bower => :version do
  bower = {
    "name"         => "jquery-flexselect",
    "version"      => package.version,
    "main"         => "jquery.flexselect.js",
    "ignore"       => [ "test", "vendor" ],
    "dependencies" => { "jquery" => ">=1.4" }
  }
  File.open("bower.json", "w") { |f| f.write(JSON.pretty_generate(bower)) }
end

desc "Stage and commit versioning changes"
task :commit => :version do
  sh "git add index.html"
  sh "git add flexselect.jquery.json"
  sh "git add bower.json"
  sh "git commit -m 'Bumped to v#{package.version}'"
end
