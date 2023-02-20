<script setup lang="ts">
import { onMounted, defineAsyncComponent, ref } from 'vue';
import { state } from '/@/views/pomelo/manage/address/config.ts';
import { handleQuery, hndleQueryProjectOptions, changeProjectID } from '/@/views/pomelo/manage/address/config.ts';
const AddressEditDialog = defineAsyncComponent(() => import('/@/views/pomelo/manage/address/components/AddressEditDialog.vue'));
const AddressEditDialogRef = ref();
const Chip = defineAsyncComponent(() => import('/@/components/pomelo/chip.vue'));

/**
 * 打开编辑弹出框
 */
const openEditDialog = (address_id: string | null) => {
	console.log(address_id);
	AddressEditDialogRef.value.openDialog(address_id);
};

onMounted(() => {
	// 由项目管理跳转
	hndleQueryProjectOptions();
	handleQuery();
});
</script>

<template>
	<div class="template-container layout-pd">
		<el-card style="border-radius: 20px">
			<div class="system-user-search mb15">
				<el-select v-model="state.form.project_id" class="m-2" placeholder="请选择项目" size="default" @change="changeProjectID">
					<el-option v-for="item in state.projectOptions" :key="item.project_id" :label="item.project_name" :value="item.project_id" />
				</el-select>
				<el-select v-model="state.form.env_id" class="ml10" placeholder="请选择环境" size="default">
					<el-option v-for="item in state.envOptions" :key="item.env_id" :label="item.env_name" :value="item.env_id" />
				</el-select>
				<el-button size="default" type="primary" class="ml10" @click="handleQuery">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="openEditDialog(null)">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增地址
				</el-button>
			</div>
			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%" size="default">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="project_name" label="项目名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="env_name" label="环境名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="address_name" label="地址名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="address" label="地址配置" show-overflow-tooltip>
					<template #default="{ row }">
						<el-link :href="row.address" type="primary" target="_blank">{{ row.address }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="operation_user" label="最近操作人员" show-overflow-tooltip>
					<template #default="{ row }">
						<Chip :user_id="row.operation_user" />
					</template>
				</el-table-column>
				<el-table-column prop="create_user" label="创建人员" show-overflow-tooltip>
					<template #default="{ row }">
						<Chip :user_id="row.create_user" />
					</template>
				</el-table-column>
				<el-table-column prop="is_default" label="默认环境地址" show-overflow-tooltip>
					<template #default="{ row }">
						<el-switch
							v-model="row.is_default"
							disabled
							style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
							:active-value="1"
							:inactive-value="0"
							size="default"
						/>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="120">
					<template #default="{ row }">
						<el-button link type="warning" size="small" @click="openEditDialog(row.address_id)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<AddressEditDialog ref="AddressEditDialogRef" @refresh="handleQuery" />
	</div>
</template>
