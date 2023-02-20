<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { state } from '/@/views/pomelo/manage/project/config.ts';
import { handleQuery } from '/@/views/pomelo/manage/project/config.ts';
import { useRouter } from 'vue-router';
const router = useRouter();
const ProjectEditDialog = defineAsyncComponent(() => import('/@/views/pomelo/manage/project/components/ProjectEditDialog.vue'));
const ProjectEditDialogRef = ref();
const Chip = defineAsyncComponent(() => import('/@/components/pomelo/chip.vue'));

/**
 * 打开编辑弹出框
 */
const openEditDialog = (project_id: string | null) => {
	ProjectEditDialogRef.value.openDialog(project_id);
};

/**
 * 管理环境
 */
const manageEnv = (project_id: string) => {
	const params: EmptyObjectType = { project_id: project_id };
	router.push({
		name: 'manageEnvironment',
		query: params,
	});
};

onMounted(() => {
	handleQuery();
});
</script>

<template>
	<div class="template-container layout-pd">
		<el-card style="border-radius: 20px">
			<div class="system-user-search mb15">
				<el-input v-model="state.form.project_name" size="default" placeholder="请输入项目名称" style="max-width: 180px" clearable />
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
					新增项目
				</el-button>
			</div>
			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%" size="default">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="project_name" label="项目名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="remark" label="描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="owner_user" label="项目负责人" show-overflow-tooltip>
					<template #default="{ row }">
						<Chip :user_id="row.owner_user" />
					</template>
				</el-table-column>
				<el-table-column prop="create_user" label="创建人员" show-overflow-tooltip>
					<template #default="{ row }">
						<Chip :user_id="row.create_user" />
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="120">
					<template #default="{ row }">
						<el-button link type="warning" size="small" @click="openEditDialog(row.project_id)">编辑</el-button>
						<el-button link type="primary" size="small" @click="manageEnv(row.project_id)">管理环境</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<ProjectEditDialog ref="ProjectEditDialogRef" @refresh="handleQuery" />
	</div>
</template>
