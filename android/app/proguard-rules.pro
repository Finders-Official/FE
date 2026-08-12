# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# Kakao SDK는 모델을 kotlinx.serialization으로 다루는데 KakaoJson이 serializer를
# 리플렉션으로 찾는다. R8은 그 참조를 못 봐서 컴파일 시 생성된 $$serializer/Companion을
# 통째로 지우고, 저장된 토큰을 읽는 순간 SerializationException이 난다(#361).
# SDK의 consumer 룰은 액티비티만 keep한다. 2.23.0 기준 @Serializable 클래스는
# 전부 *.model 패키지 안에 있다(auth/common/share/template/user).
-keep class com.kakao.sdk.**.model.* { <fields>; }
