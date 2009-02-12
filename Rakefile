require 'rake/packagetask'
require 'highline/import'

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

# task :publish do
#   puts "not implemented yet"
# end

task :release => :repackage do
  sh("git tag 'v#{package.version}'") if agree("Create a tag?", true)
  puts("\n *** Don't forget to `git push --tags` ***")
end
