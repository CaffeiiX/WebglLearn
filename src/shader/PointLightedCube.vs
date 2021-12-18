attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;
uniform mat4 u_ModelMatrix;
uniform mat4 u_MvpMatrix;
uniform mat4 u_NormalMatrix;
uniform vec3 u_LightPosition;
uniform vec3 u_LightColor;
uniform vec3 u_AmbientLight;
varying vec4 v_Color;
void main(){
    gl_Position = u_MvpMatrix * a_Position;
    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
    //顶点坐标的转换，以及计算点光源到顶点坐标的方向
    vec4 vertexPosition = u_ModelMatrix * a_Position;
    vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));
    //获取顶点的颜色内容
    float nDotL = max(dot(lightDirection, normal), 0.0);
    vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;
    vec3 ambient = u_AmbientLight * a_Color.rgb;
    v_Color = vec4(diffuse + ambient, a_Color.a);
}
