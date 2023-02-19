<script setup lang="ts">
import { onMounted, ref, defineAsyncComponent } from 'vue';
import { ConnectionState, Chip, ManageStatus } from '/@/views/pomelo/manage/databases/config.ts';
import { state } from '/@/views/pomelo/manage/databases/config.ts';
import { handleQuery, handleStatus } from '/@/views/pomelo/manage/databases/config.ts';
/* 编辑弹出框 */
const DataBaseEditDialog = defineAsyncComponent(() => import('/@/views/pomelo/manage/databases/components/DatabaseEditDialog.vue'));

const DataBaseEditDialogRef = ref();

/**
 * 打开编辑弹出框
 */
const openEditDialog = (database_id: string | null) => {
	DataBaseEditDialogRef.value.openDialog(database_id);
};

onMounted(() => {
	handleQuery();
});
</script>

<template>
	<div class="template-container layout-pd">
		<el-card style="border-radius: 20px">
			<div class="system-user-search mb15">
				<el-input v-model="state.form.database_name" size="default" placeholder="请输入数据库名称" style="max-width: 180px" clearable />
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
					新增数据库
				</el-button>
			</div>
			<el-table :data="state.tableData" style="width: 100%" size="default">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="database_name" label="数据库名称" show-overflow-tooltip></el-table-column>
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
				<el-table-column prop="last_connection_state" label="上次连接状态" show-overflow-tooltip>
					<template #default="{ row }">
						<ConnectionState :state="row.last_connection_state" />
					</template>
				</el-table-column>
				<el-table-column prop="last_connection_time" label="上次连接时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="is_delete" label="数据库状态" show-overflow-tooltip>
					<template #default="{ row }">
						<ManageStatus :status="row.is_delete" @update:status="handleStatus($event, row.database_id)" />
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="120">
					<template #default="{ row }">
						<el-button link type="warning" size="small" @click="openEditDialog(row.database_id)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<DataBaseEditDialog ref="DataBaseEditDialogRef" @refresh="handleQuery" />
	</div>
</template>
