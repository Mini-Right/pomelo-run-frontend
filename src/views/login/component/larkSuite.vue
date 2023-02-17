<template>
	<el-form size="large" class="login-content-form">
		<el-form-item class="login-animation3">
			<el-button round type="primary" v-waves class="login-content-submit" @click="onLarkSuiteSignIn">
				<span>飞书登录</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" name="loginAccount" setup>
import { useLoginApi } from '/@/api/login';
import { reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { initFrontEndControlRoutes } from '/@/router/frontEnd';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { Session } from '/@/utils/storage';
import { formatAxis } from '/@/utils/formatTime';
import { NextLoading } from '/@/utils/loading';

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const route = useRoute();

const state = reactive({
	loading: {
		signIn: false,
	},
});
const onLarkSuiteSignIn = async () => {
	console.log(import.meta.env.VITE_LARK_SUITE_URI);
	window.open(import.meta.env.VITE_LARK_SUITE_URI, '_self');
};

const currentTime = computed(() => {
	return formatAxis(new Date());
});

onMounted(async () => {
	const params = new URLSearchParams(window.location.search);
	let code = params.get('code');
	console.log(code);
	if (code) {
		await onSignIn(code);
	}
});

const onSignIn = async (code: string) => {
	const { signInLarkSuite } = useLoginApi();
	const { data: userInfo } = await signInLarkSuite({ code: code });
	const { token } = userInfo;

	// state.loading.signIn = true;
	// // 存储 token 到浏览器缓存
	Session.set('token', token);
	// // 模拟数据，对接接口时，记得删除多余代码及对应依赖的引入。用于 `/src/stores/userInfo.ts` 中不同用户登录判断（模拟数据）
	if (!themeConfig.value.isRequestRoutes) {
		// 前端控制路由，2、请注意执行顺序
		console.log('前端控制路由');
		const isNoPower = await initFrontEndControlRoutes();
		signInSuccess(isNoPower);
	} else {
		// 模拟后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
		// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
		console.log('后端控制路由');
		const isNoPower = await initBackEndControlRoutes();
		// 执行完 initBackEndControlRoutes，再执行 signInSuccess
		signInSuccess(isNoPower);
	}
};

const signInSuccess = (isNoPower: boolean | undefined) => {
	if (isNoPower) {
		ElMessage.warning('抱歉，您没有登录权限');
		Session.clear();
	} else {
		// 初始化登录成功时间问候语
		let currentTimeInfo = currentTime.value;
		// 登录成功，跳到转首页
		// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
		console.log('path', <string>route.query?.redirect);
		console.log('query', Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '');
		window.open(`${location.protocol}//${location.host}`, '_self');
		// 登录成功提示
		const signInText = '登录成功';
		ElMessage.success(`${currentTimeInfo}, ${signInText}`);
		// 添加 loading，防止第一次进入界面时出现短暂空白
		NextLoading.start();
	}
	state.loading.signIn = false;
};
</script>

<style scoped lang="scss">
.login-content-form {
	margin-top: 20px;
	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}
	.login-content-code {
		width: 100%;
		padding: 0;
	}
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
	.login-msg {
		color: var(--el-text-color-placeholder);
	}
}
</style>
