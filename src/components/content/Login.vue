<template>
  <div>
    <div class="scroll-down">
      向下滚动
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
      >
        <path d="M16 3C8.832031 3 3 8.832031 3 16s5.832031 13 13 13 13-5.832031 13-13S23.167969 3 16 3zm0 2c6.085938 0 11 4.914063 11 11 0 6.085938-4.914062 11-11 11-6.085937 0-11-4.914062-11-11C5 9.914063 9.914063 5 16 5zm-1 4v10.28125l-4-4-1.40625 1.4375L16 23.125l6.40625-6.40625L21 15.28125l-4 4V9z" />
      </svg>
      <p class="modal-desc"></p>
    </div>
    <div class="modal">
      <div class="modal-container">
        <div class="modal-left">
          <h1 class="modal-title">欢迎回来!</h1>
          <br />
          <a-form
            id="components-form-demo-normal-login"
            :form="form"
            class="login-form"
            @submit="handleSubmit"
          >
            <input
              type="text"
              style="display: none;"
            >
            <input
              type="password"
              style="display: none;"
            >
            <!-- 账号登录方式 -->
            <a-form-item
              v-if="isPhone==false"
              has-feedback
            >
              <a-input
                v-decorator="[
                  'userAccount',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入你的账号!',
                      },
                    ],
                  },
                ]"
                placeholder="Username"
              >
                <a-icon
                  slot="prefix"
                  type="user"
                  style="color: rgba(0, 0, 0, 0.25)"
                />
              </a-input>

            </a-form-item>
            <a-form-item
              v-if="isPhone==false"
              has-feedback
            >
              <a-input
                v-decorator="[
                  'userPassword',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入你的密码!',
                      }
                    ],
                  },
                ]"
                type="password"
                placeholder="Password"
              >
                <a-icon
                  slot="prefix"
                  type="lock"
                  style="color: rgba(0, 0, 0, 0.25)"
                />
              </a-input>
            </a-form-item>
            <!-- 手机登录方式 -->
            <a-form-item v-if="isPhone==true">
              <a-input
                v-decorator="[
                  'phone',
                  {
                    rules: [{ required: true, message: '请输入你的手机号码!' }],
                  },
                ]"
                style="width: 100%"
              >
                <a-select
                  slot="addonBefore"
                  v-decorator="['prefix', { initialValue: '86' }]"
                  style="width: 70px"
                >
                  <a-select-option value="86">
                    +86
                  </a-select-option>
                  <a-select-option value="87">
                    +87
                  </a-select-option>
                </a-select>
              </a-input>
            </a-form-item>
            <a-form-item v-if="isPhone==true">
              <a-row :gutter="8">
                <a-col :span="12">
                  <a-input v-decorator="[
                    'captcha',
                    { rules: [{ required: true, message: '请输入您获得的验证码!' }] },
                  ]" />
                </a-col>
                <a-col :span="12">
                  <a-button>获取验证码</a-button>
                </a-col>
              </a-row>
            </a-form-item>
            <!-- 记住我 -->
            <a-form-item>
              <a-checkbox v-decorator="[
                'remember',
                {
                  valuePropName: 'checked',
                  initialValue: remember,
                },
              ]">
                记住我
              </a-checkbox>
              <a class="login-form-forgot"> 忘记密码？ </a>
              <a-button
                type="primary"
                html-type="submit"
                class="login-form-button"
              >
                登录
              </a-button>
              <a
                @click="changeLoginMode"
                style="float:right;"
              >
                {{ modeLabel }}
              </a>
            </a-form-item>
          </a-form>
        </div>
        <div class="modal-right">
          <img
            src="images/mate.jpg"
            alt
          />
        </div>
        <button
          class="icon-button close-button"
          @click="closeModal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
          >
            <path d="M 25 3 C 12.86158 3 3 12.86158 3 25 C 3 37.13842 12.86158 47 25 47 C 37.13842 47 47 37.13842 47 25 C 47 12.86158 37.13842 3 25 3 z M 25 5 C 36.05754 5 45 13.94246 45 25 C 45 36.05754 36.05754 45 25 45 C 13.94246 45 5 36.05754 5 25 C 5 13.94246 13.94246 5 25 5 z M 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.980469 15.990234 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 z" />
          </svg>
        </button>
      </div>
      <button
        class="modal-button"
        @click="openModal"
      >点击此处登录</button>
    </div>
  </div>
</template>

<script>
import { login, User } from '@/network/login.js'
import { getCookie, setCookie } from '@/common/util.js'
import { Base64 } from 'js-base64'
export default {
  data() {
    return {
      isOpened: false,
      hasErrors(fieldsError) {
        return Object.keys(fieldsError).some((field) => fieldsError[field])
      },
      user: {},
      account: '',
      password: '',
      remember: false,
      isPhone: false,
    }
  },
  computed: {
    modeLabel() {
      return this.isPhone ? '账号登录' : '手机登录'
    },
  },
  watch: {
    isPhone() {
      if (this.isPhone) {
        this.$message.info('功能尚未实现')
      }
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'normal_login' })
  },
  created() {
    // 绑定滚动条事件
    window.addEventListener('scroll', () => {
      if (window.scrollY > window.innerHeight / 3 && !this.isOpened) {
        const scrollDown = document.querySelector('.scroll-down')
        this.isOpened = true
        scrollDown.style.display = 'none'
        this.openModal()
      }
    })
  },
  mounted() {
    // 在页面加载时从cookie获取登录信息
    let account = getCookie('account')
    // 如果存在赋值给表单，并且将记住密码勾选
    if (account) {
      this.form.setFieldsValue({ userAccount: account })
      let password = Base64.decode(getCookie('password'))
      this.form.setFieldsValue({ userPassword: password })
      this.remember = true
    }

    this.$nextTick(() => {
      this.form.validateFields()
    })
  },
  methods: {
    openModal() {
      const body = document.querySelector('body')
      const modal = document.querySelector('.modal')
      modal.classList.add('is-open')
      body.style.overflow = 'hidden'
    },
    closeModal() {
      const body = document.querySelector('body')
      const modal = document.querySelector('.modal')
      modal.classList.remove('is-open')
      body.style.overflow = 'initial'
    },
    changeLoginMode() {
      this.isPhone = !this.isPhone
    },
    userNameError() {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('userName') && getFieldError('userName')
    },
    passwordError() {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('password') && getFieldError('password')
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          login(values).then((res) => {
            if (res.msg == 'success') {
              this.token = res.loginInfo.token
              this.user = new User(res.loginInfo)
              this.$message.success(`欢迎回来，${this.user.name}`)
              this.saveLoginInfo(values)
              this.$router.push({
                path: `/home`,
              })
            } else {
              this.$message.warning(res.msg)
            }
          })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('success')
        } else {
          return false
        }
      })
    },
    saveLoginInfo(formData) {
      // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
      this.remember = this.form.getFieldValue('remember')
      if (this.remember) {
        setCookie('account', formData['userAccount'])
        // base64加密密码
        let password = Base64.encode(formData['userPassword'])
        this.user.password = password
        setCookie('password', password)
        setCookie('remember', true)
      } else {
        // 如果没有勾选，储存的信息为空
        setCookie('account', '')
        setCookie('password', '')
        setCookie('remember', false)
      }
      window.sessionStorage.setItem('token', this.token)
      window.sessionStorage.setItem('user', JSON.stringify(this.user))
    },
  },
}
</script>

<style scoped>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}

.container {
  height: 200vh;
  background-image: url('/images/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.modal {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background: rgba(51, 51, 51, 0.5);
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.modal-container {
  display: -webkit-box;
  display: flex;
  max-width: 720px;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  position: absolute;
  opacity: 0;
  pointer-events: none;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  background: #fff;
  -webkit-transform: translateY(100px) scale(0.4);
  transform: translateY(100px) scale(0.4);
}

.modal-title {
  font-size: 26px;
  margin: 0;
  font-weight: 400;
  color: #55311c;
}

.modal-desc {
  margin: 6px 0 30px 0;
  font-size: 12px;
}

.modal-left {
  padding: 60px 30px 20px;
  background: #fff;
  -webkit-box-flex: 1.5;
  flex: 1.5;
  -webkit-transition-duration: 0.5s;
  transition-duration: 0.5s;
  -webkit-transform: translateY(80px);
  transform: translateY(80px);
  opacity: 0;
}

.modal-button {
  color: #7d695e;
  font-family: 'Nunito', sans-serif;
  font-size: 18px;
  cursor: pointer;
  border: 0;
  outline: 0;
  padding: 10px 40px;
  border-radius: 30px;
  background: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.16);
  -webkit-transition: 0.3s;
  transition: 0.3s;
}

.modal-button:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.8);
}

.modal-right {
  -webkit-box-flex: 2;
  flex: 2;
  font-size: 0;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  overflow: hidden;
}

.modal-right img {
  width: 100%;
  height: 100%;
  -webkit-transform: scale(2);
  transform: scale(2);
  -o-object-fit: cover;
  object-fit: cover;
  -webkit-transition-duration: 1.2s;
  transition-duration: 1.2s;
}

.modal.is-open {
  height: 100%;
  background: rgba(51, 51, 51, 0.85);
}

.modal.is-open .modal-button {
  opacity: 0;
}

.modal.is-open .modal-container {
  opacity: 1;
  -webkit-transition-duration: 0.6s;
  transition-duration: 0.6s;
  pointer-events: auto;
  -webkit-transform: translateY(0) scale(1);
  transform: translateY(0) scale(1);
}

.modal.is-open .modal-right img {
  -webkit-transform: scale(1);
  transform: scale(1);
}

.modal.is-open .modal-left {
  -webkit-transform: translateY(0);
  transform: translateY(0);
  opacity: 1;
  -webkit-transition-delay: 0.1s;
  transition-delay: 0.1s;
}

.modal-buttons {
  display: -webkit-box;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
}

.modal-buttons a {
  color: rgba(51, 51, 51, 0.6);
  font-size: 14px;
  margin: 20px auto;
}

.sign-up {
  margin: 60px 0 0;
  font-size: 14px;
  text-align: center;
}

.sign-up a {
  color: #8c7569;
}

.input-button {
  padding: 8px 12px;
  outline: none;
  border: 0;
  color: #fff;
  border-radius: 4px;
  background: #8c7569;
  font-family: 'Nunito', sans-serif;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  cursor: pointer;
}

.input-button:hover {
  background: #55311c;
}

.input-label {
  font-size: 11px;
  text-transform: uppercase;
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  letter-spacing: 0.7px;
  color: #8c7569;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}

.input-block {
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  padding: 10px 10px 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}

.input-block input {
  outline: 0;
  border: 0;
  padding: 4px 0 0;
  font-size: 14px;
  font-family: 'Nunito', sans-serif;
  border-radius: 5px;
}

.input-block input::-webkit-input-placeholder {
  color: #ccc;
  opacity: 1;
}

.input-block input::-moz-placeholder {
  color: #ccc;
  opacity: 1;
}

.input-block input:-ms-input-placeholder {
  color: #ccc;
  opacity: 1;
}

.input-block input::-ms-input-placeholder {
  color: #ccc;
  opacity: 1;
}

.input-block input::placeholder {
  color: #ccc;
  opacity: 1;
}

.input-block:focus-within {
  border-color: #8c7569;
}

.input-block:focus-within .input-label {
  color: rgba(140, 117, 105, 0.8);
}

.icon-button {
  outline: 0;
  position: absolute;
  right: 10px;
  top: 12px;
  width: 32px;
  height: 32px;
  border: 0;
  background: 0;
  padding: 0;
  cursor: pointer;
}

.scroll-down {
  position: fixed;
  top: 50%;
  left: 50%;
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  text-align: center;
  color: #7d695e;
  font-size: 32px;
  font-weight: 800;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.scroll-down svg {
  margin-top: 16px;
  width: 52px;
  fill: currentColor;
}

@media (max-width: 750px) {
  .modal-container {
    width: 90%;
  }

  .modal-right {
    display: none;
  }
}
</style>
