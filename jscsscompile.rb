#!/usr/bin/env ruby

# Asset tasks

require 'rubygems'
require 'bundler'
require 'pathname'
require 'logger'
require 'fileutils'
require 'rb-fsevent'

# Require gems from Gemfile
Bundler.require

# Configuration
ROOT = Pathname(File.dirname(__FILE__))
LOGGER = Logger.new(STDOUT)
BUNDLES = %w( all.js all.css )
BUILD_DIR = ROOT.join("build")
SOURCE_DIR = ROOT.join("src")

# register handlebar templates
Sprockets.register_engine '.hbs', HandlebarsAssets::TiltHandlebars

# Compile all assets
class Tasks
  def compile 
    cleanup()
    begin
      # Create a new Sprockets::Environment instance, passing in some configurations
      sprockets = Sprockets::Environment.new(ROOT) do |env|
        env.logger = LOGGER
      end
      # Append the asset paths
      sprockets.append_path(SOURCE_DIR.join('javascripts').to_s)
      sprockets.append_path(SOURCE_DIR.join('stylesheets').to_s)
      
      # Process and package the assets to the build directory
      BUNDLES.each do |bundle|
        puts bundle
        assets = sprockets.find_asset(bundle)
      
        # split on
        prefix, basename = assets.pathname.to_s.split('/')[-2..-1]
        realname = basename.split(".")[0..1].join(".")
        
        # Add digest to filename in production
        if ENV['env'] == 'production'
          basename, ext = basename.split(".")[0..1]
          realname = "#{basename}-#{assets.digest}.#{ext}"
        end
        
        # Write concatenated asset
        FileUtils.mkpath BUILD_DIR
        assets.write_to(BUILD_DIR.join(realname))
        
        # Write minified asset
        if ENV['env'] == 'production'
          Minifier.minify [:src => BUILD_DIR.join(realname), :dst => BUILD_DIR.join(realname)]
        end
        
        # If you want to reference a single CSS file (e.g. filename.css) instead of an entire bundle. Build a standalone package for each CSS source
        # assets.to_a.each do |asset|
        # # strip filename.css.foo.bar.css multiple extensions
        # realname = asset.pathname.basename.to_s.split(".")[0..1].join(".")
        # asset.write_to(BUILD_DIR.join(prefix, realname))
        # end
      end
    rescue Exception => e
      puts e.message
    end
  end
  
  # Watch source directory for file changes and compile
  def watch
    compile()
    # options = {:latency => 4, :no_defer => true }
    fsevent = FSEvent.new
    fsevent.watch SOURCE_DIR.to_s do |directories|
      puts "Detected change inside: #{directories.inspect}"
      
      Rake::Task["compile"].reenable
      Rake::Task["compile"].invoke
    end
    fsevent.run
  end
  
  # Cleanup asset directory
  def cleanup
    dirs = Dir.glob(File.join(BUILD_DIR.join("{*.js,*.css}")))
    dirs.each do |dir|
      FileUtils.rm_rf dir
    end
  end
end

# Minify assets
module Minifier
  def Minifier.minify(files)
    files.each do |file|
      cmd = "java -jar ../tools/yuicompressor/build/yuicompressor-2.4.6.jar #{file[:src]} -o #{file[:dst]} --charset utf-8"
      puts cmd
      ret = system(cmd) # *** SYSTEM RUN LOCAL COMMANDS ***
      raise "Minification failed for #{file}" if !ret
    end
  end
end

###################################################################

tasks = Tasks.new
ARGV.each do|a|
  if tasks.respond_to?(a) 
    tasks.send(a)
    puts 'Command #{a} inviked'
  else
    puts 'No valid command'
  end 
end
