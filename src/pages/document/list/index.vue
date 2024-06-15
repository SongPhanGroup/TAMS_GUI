<script setup lang="ts">
import { getDocument, deleteDocument } from "@/services/document.service";
import { useWatcher } from "alova";

type invoiceStatus =
  | "Downloaded"
  | "Draft"
  | "Paid"
  | "Sent"
  | "Partial Payment"
  | "Past Due"
  | null;

const searchQuery = ref("");
const selectedStatus = ref<invoiceStatus>(null);
const selectedRows = ref<string[]>([]);

// Data table options
const pageSize = ref("10");
const page = ref("1");
const sortBy = ref();
const orderBy = ref();

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key;
  orderBy.value = options.sortBy[0]?.order;
};

const widgetData = ref([
  { title: "Clients", value: 24, icon: "tabler-user" },
  { title: "Invoices", value: 165, icon: "tabler-file-invoice" },
  { title: "Paid", value: "$2.46k", icon: "tabler-checks" },
  { title: "Unpaid", value: "$876", icon: "tabler-circle-off" },
]);

// 👉 headers
const headers = [
  { title: "Tên tập tin", key: "name" },
  { title: "Trạng thái", key: "status" },
  { title: "Người tải lên", key: "createdBy" },
  { title: "Ngày tải", key: "createdAt" },
  { title: "Hành động", key: "actions", sortable: false },
];

// 👉 Fetch Invoices
const { loading, data } = useWatcher(
  () => {
    // Tạo đối tượng tham số với điều kiện
    const params: any = {
      page: page.value,
      pageSize: pageSize.value,
      search: searchQuery.value,
      status: selectedStatus.value,
      sortBy: sortBy.value,
      orderBy: orderBy.value,
    };
    // if (searchQuery.value) {
    //   params.search = searchQuery.value;
    // }

    return getDocument(params);
  },
  [searchQuery, selectedStatus, pageSize, page, sortBy, orderBy],
  {
    debounce: [500],
    immediate: true,
  }
);

// 👉 Invoice balance variant resolver
const resolveInvoiceBalanceVariant = (
  balance: string | number,
  total: number
) => {
  if (balance === total) return { status: "Unpaid", chip: { color: "error" } };

  if (balance === 0) return { status: "Paid", chip: { color: "success" } };

  return { status: balance, chip: { variant: "text" } };
};

// 👉 Invoice status variant resolver
const resolveStatus = (statusMsg: number) => {
  if (statusMsg === 0) return { text: "Chưa xử lý", color: "warning" };
  else if (statusMsg === 1) return { text: "Đã xử lý", color: "success" };
  else return { text: "Lỗi", color: "error" };
};

const computedMoreList = computed(() => {
  return (paramId: number) => [
    { title: "Download", value: "download", prependIcon: "tabler-download" },
    {
      title: "Edit",
      value: "edit",
      prependIcon: "tabler-pencil",
      to: { name: "apps-invoice-edit-id", params: { id: paramId } },
    },
    {
      title: "Duplicate",
      value: "duplicate",
      prependIcon: "tabler-layers-intersect",
    },
  ];
});

// 👉 Delete Invoice
const handleDeleteCheckingDocument = async (id: string) => {
  // await $api(`/apps/invoice/${id}`, { method: "DELETE" });
  deleteDocument(id)
    .then((res: any) => {
      if (res.status !== "error") {
        showMessage("Xóa tài liệu thành công!", "success");
      } else {
        showMessage("Xóa tài liệu thất bại!", "error");
      }
    })
    .catch((error) => {
      showMessage("Có lỗi xảy ra!", "error");
    });
};
</script>

<template>
  <section v-if="!loading">
    <!-- 👉 Invoice Widgets -->

    <VCard id="invoice-list">
      <VCardText
        class="d-flex justify-space-between align-center flex-wrap gap-4"
      >
        <div class="d-flex gap-4 align-center flex-wrap">
          <div class="d-flex align-center gap-2">
            <span>Show</span>
            <AppSelect
              :model-value="pageSize"
              :items="[
                { value: 10, title: '10' },
                { value: 25, title: '25' },
                { value: 50, title: '50' },
                { value: 100, title: '100' },
                { value: -1, title: 'All' },
              ]"
              style="inline-size: 5.5rem"
              @update:model-value="pageSize = parseInt($event, 10)"
            />
          </div>
          <!-- 👉 Create invoice -->
          <VBtn prepend-icon="tabler-plus" :to="{ name: 'document-add' }">
            Create invoice
          </VBtn>
        </div>

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div class="invoice-list-filter">
            <AppTextField v-model="searchQuery" placeholder="Search Invoice" />
          </div>

          <!-- 👉 Select status -->
          <div class="invoice-list-filter">
            <AppSelect
              v-model="selectedStatus"
              placeholder="Invoice Status"
              clearable
              clear-icon="tabler-x"
              single-line
              :items="[
                'Downloaded',
                'Draft',
                'Sent',
                'Paid',
                'Partial Payment',
                'Past Due',
              ]"
            />
          </div>
        </div>
      </VCardText>
      <VDivider />

      <!-- SECTION Datatable -->
      <VDataTableServer
        v-model="selectedRows"
        v-model:items-per-page="pageSize"
        v-model:page="page"
        show-select
        :items-length="data?.pagination?.totalRecords"
        :headers="headers"
        :items="data?.data"
        item-value="id"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <!-- id -->
        <template #item.id="{ item }">
          <RouterLink :to="{ name: 'document-add', params: { id: item.id } }">
            #{{ item.id }}
          </RouterLink>
        </template>

        <!-- client -->
        <template #item.name="{ item }">
          <div class="d-flex align-center gap-x-4">
            <div class="d-flex flex-column">
              <span class="text-body-1 font-weight-medium text-high-emphasis"
                >#{{ item?.name }}</span
              >
            </div>
          </div>
        </template>

        <template #item.status="{ item }">
          <VChip
            v-bind="resolveStatus(item.status)"
            density="default"
            label
            size="small"
          />
        </template>

        <template #item.createdBy="{ item }">
          <span class="text-body-1 text-high-emphasis"
            >#{{ item?.fullName }}</span
          >
        </template>

        <template #item.actions="{ item }">
          <IconBtn
            :to="{ name: 'document-preview-id', params: { id: item.id } }"
          >
            <VIcon icon="tabler-eye" />
          </IconBtn>

          <IconBtn>
            <VIcon icon="tabler-edit" />
          </IconBtn>

          <IconBtn @click="handleDeleteCheckingDocument(item.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn>
        </template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="pageSize"
            :total-items="data?.pagination?.totalRecords"
          />
        </template>
      </VDataTableServer>
      <!-- !SECTION -->
    </VCard>
  </section>
  <section v-else>
    <VCard>
      <VCardTitle>No Invoice Found</VCardTitle>
    </VCard>
  </section>
</template>

<style lang="scss">
#invoice-list {
  .invoice-list-actions {
    inline-size: 8rem;
  }

  .invoice-list-filter {
    inline-size: 12rem;
  }
}
</style>
