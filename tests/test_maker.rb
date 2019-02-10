require 'base64'
require 'json'

chars = JSON.parse(File.read(File.join(File.dirname(__FILE__), 'unicode_chars.json')))

tests = []

100.times do
  str = ''

  n = rand(0..500)

  n.times do
    str << chars.sample
  end

  tests << {
    src: str,
    trg: Base64.encode64(str)
  }
end

json = JSON.generate(tests)

File.open(File.join(File.dirname(__FILE__), 'tests.json'), 'w') do |f|
  f.write(json)
end
