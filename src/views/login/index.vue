<template>
  <div class="login-container">

    <div class="login-main flex-row-between" v-if="!show">
      <div class="left"></div>
      <!-- 注册表单 -->
      <el-form v-if="isShow" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <div class="title-container">
          <h3 class="title">注册登录</h3>
        </div>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input ref="username" v-model="loginForm.username" placeholder="Username" name="username" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="Password" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <!-- 登录注册切换按钮 -->
        <el-form-item>
          <el-button size="mini" type="text" @click="isShow= !isShow">登录</el-button>
        </el-form-item>
      </el-form>
      <!-- 登录表单 -->
      <el-form v-else ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

        <div class="title-container">
          <h3 class="title">欢迎登录</h3>
        </div>

        <el-form-item>
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input ref="username" v-model="loginForm.name" placeholder="Username" name="username" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>

        <el-form-item>
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="Password" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

        <!-- 登录注册切换按钮 -->
        <el-form-item>
          <el-button size="mini" type="text" @click="isShow= !isShow">注册</el-button>
        </el-form-item>

      </el-form>

    </div>
    <div class="mask" v-else>
      <div class="con">
        <el-dialog title="请选择登陆的角色" :visible.sync="show" width="30%" :before-close="handleClose">
          <el-radio-group v-model="roleId">
            <el-radio v-for="(role,index) in rolesList" :label="role.roleId" :key="index">{{role.roleName}}</el-radio>
            <!-- <el-radio v-model="radio" label="2">备选项</el-radio> -->
          </el-radio-group>
          <span slot="footer" class="dialog-footer">
            <el-button @click="show = false">取 消</el-button>
            <el-button type="primary" @click="sureBtn">确 定</el-button>
          </span>
        </el-dialog>

      </div>
    </div>
  </div>

</template>
<script>
import { validUsername } from '@/utils/validate';
import { login, } from "@/api/api";
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        name: 'liulian',
        password: '123456',
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      isShow: false, // 控制登录或者注册表单显示
      Verify: null,
      show: false,
      rolesList: [],
      roleId: null
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getInfo()
  },
  methods: {
    // 弹框确定按钮
    sureBtn() {
      if (this.roleId !== null) {
        this.$message({
          message: '恭喜你，登录成功！',
          type: 'success'
        });
        this.show = false
        sessionStorage.setItem('roleId', this.roleId)
        this.$router.push('/dashboard/dashboard');
      } else {
        this.show = false
        this.$router.push('/')
      }

    },
    getInfo() {

    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          login(this.loginForm).then((res) => {

            console.log(res.data.admin.roles)
            if (res.data.admin.roles.length === 1) {
              this.$message({
                message: '恭喜你，登录成功！',
                type: 'success'
              });
              sessionStorage.setItem('roleId', res.data.admin.roles[0].roleId)
              this.$router.push('/dashboard/dashboard');

            } else {
              this.show = true
              this.rolesList = res.data.admin.roles
            }
            sessionStorage.setItem('token', res.data.token)
          })

        } else {
          return false;
        }
      });

    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" >
$bg: #abcf46;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  // background-image: url('https://i0.hippopx.com/photos/963/130/574/mountains-passes-clouds-mist-thumb.jpg');
  background-image: url("https://i0.hippopx.com/photos/563/564/864/anime-late-stage-the-scenery-preview.jpg");
  background-image: url("https://i0.hippopx.com/photos/761/692/1010/grass-green-nature-lawn-preview.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;

  align-items: center;
  // filter: blur(10px);
  .login-main {
    width: 50%;
    background-image: url("https://i0.hippopx.com/photos/247/324/14/tour-sightseeing-landscape-travel-preview.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    border: 1px solid $dark_gray;
    box-shadow: 0 1px 4px rgba(27, 216, 84, 0.3),
      0 0 20px rgba(0, 0, 0, 0.1) inset;

    .left {
      width: 40%;
      height: 520px;
      background: rgba(27, 216, 84, 0.3);
      // opacity: 0.9;
      // background: #008374;
      // opacity: 0.3;
    }
  }

  .login-form {
    position: relative;
    width: 60%;
    max-width: 100%;
    height: 520px;
    overflow: hidden;
    padding: 80px 60px;
    background: #008374;
    opacity: 0.9;
    .el-form-item:last-child {
      background: none;
      border: none;
      text-align: right;
      .el-button {
        color: $light_gray;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.mask {
  background: rgba(34, 34, 34, 0.9);
  width: 100%;
  height: 100vh;
  padding-top: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  .el-dialog {
    margin-top: 15% !important;
  }
}
</style>
