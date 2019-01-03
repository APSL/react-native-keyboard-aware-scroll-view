require 'json'
version = JSON.parse(File.read('package.json'))["version"]

Pod::Spec.new do |s|

  s.name            = "react-native-keyboard-aware-scroll-view"
  s.version         = version
  s.homepage        = "https://github.com/wordpress-mobile/react-native-keyboard-aware-scroll-view"
  s.summary         = "React Native module to arrange scroll poisition according to keyboard on input fields."
  s.license         = "MIT"
  s.author          = "WordPress Mobile Gutenberg Team"
  s.platform        = :ios, "8.0"
  s.source          = { :git => "https://github.com/wordpress-mobile/react-native-keyboard-aware-scroll-view.git", :tag => s.version.to_s }
  s.source_files    = "ios/RNKeyboardAwareScrollView/*.{h,m}"
  s.preserve_paths  = "**/*.js"

  s.dependency 'React'
end
