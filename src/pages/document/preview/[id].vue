<script setup lang="ts">
import { detailDocument, editDocument } from "@/services/document.service";
import { useRequest } from "alova";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { extractDocument } from "@/services/sentenceDoc.service";

const optionCounter = ref(1);

const dropZoneRef = ref<HTMLDivElement>();
interface FileData {
  file: File;
  url: string;
}
const route = useRoute();
const rules = [
  (fileList: FileList) =>
    !fileList ||
    !fileList.length ||
    fileList[0].size < 1000000 ||
    "Avatar size should be less than 1 MB!",
];
const fileData = ref<FileData[]>([]);
const { onChange } = useFileDialog({ accept: "image/*" });

const description = ref("");
const file = ref<any>();

detailDocument(route.params.id).then((res: any) => {
  description.value = res.data.description;
});

function onDrop(DroppedFiles: File[] | null) {
  DroppedFiles?.forEach((file) => {
    if (file.type.slice(0, 6) !== "image/") {
      // eslint-disable-next-line no-alert
      alert("Only image files are allowed");

      return;
    }

    fileData.value.push({
      file,
      url: useObjectUrl(file).value ?? "",
    });
  });
}

onChange((selectedFiles) => {
  if (!selectedFiles) return;

  for (const file of selectedFiles) {
    fileData.value.push({
      file,
      url: useObjectUrl(file).value ?? "",
    });
  }
});

useDropZone(dropZoneRef, onDrop);

const content = ref(
  `<p>
    Keep your account secure with authentication step.
    </p>`
);

const activeTab = ref("Restock");
const isTaxChargeToProduct = ref(true);
const isDialogVisible = ref(false)

const shippingList = [
  {
    desc: "You'll be responsible for product delivery.Any damage or delay during shipping may cost you a Damage fee",
    title: "Fulfilled by Seller",
    value: "Fulfilled by Seller",
  },
  {
    desc: "Your product, Our responsibility.For a measly fee, we will handle the delivery process for you.",
    title: "Fulfilled by Company name",
    value: "Fulfilled by Company name",
  },
] as const;

const shippingType = ref<(typeof shippingList)[number]["value"]>(
  "Fulfilled by Company name"
);
const deliveryType = ref("Worldwide delivery");
const selectedAttrs = ref(["Biodegradable", "Expiry Date"]);

const inventoryTabsData = [
  { icon: "tabler-cube", title: "Restock", value: "Restock" },
  { icon: "tabler-car", title: "Shipping", value: "Shipping" },
  {
    icon: "tabler-map-pin",
    title: "Global Delivery",
    value: "Global Delivery",
  },
  { icon: "tabler-world", title: "Attributes", value: "Attributes" },
  { icon: "tabler-lock", title: "Advanced", value: "Advanced" },
];

const handleEditDocument = async () => {
  editDocument(route.params.id, { description: description.value }).then(
    (res) => {
      console.log(res);
    }
  );

  // fetchInvoices()
};

const handleExtractDocument = async () => {
  isDialogVisible.value = true;
  extractDocument(route.params.id).then(
    (res) => {
      console.log(res);
      isDialogVisible.value = false;
    }
  );

  // fetchInvoices()
};
</script>

<template>
  <div>
    <div
      class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6"
    >
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">Add a new product</h4>
        <div class="text-body-1">Orders placed across your store</div>
      </div>
    </div>

    <VRow>
      <VCol md="8">
        <!-- 👉 Product Information -->
        <VCard class="mb-6" title="Product Information">
          <VCardText>
            <VForm
              @submit.prevent="
                (e) => {
                  handleEditDocument();
                }
              "
            >
              <VRow>
                <VCol cols="12">
                  <AppTextarea
                    v-model="description"
                    label="Default"
                    placeholder="Placeholder Text"
                  />
                </VCol>

                <VCol cols="12">
                  <VFileInput
                    v-model="file"
                    label="File"
                    accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    placeholder="Pick an avatar"
                  />
                </VCol>

                <VCol cols="12" class="d-flex gap-4">
                  <VBtn type="submit"> Submit </VBtn>
                  <VBtn type="button" color="info" @click="handleExtractDocument()"> Xử lý </VBtn>

                  <VBtn type="reset" color="secondary" variant="tonal">
                    Reset
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
  <VDialog
    v-model="isDialogVisible"
    persistent
    width="300"
  >
    <VCard
      color="primary"
      width="300"
    >
      <VCardText class="pt-3">
        Please stand by
        <VProgressLinear
          indeterminate
          bg-color="rgba(var(--v-theme-surface), 0.1)"
          :height="8"
          class="mb-0 mt-4"
        />
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.drop-zone {
  border: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 6px;
}
</style>

<style lang="scss">
.inventory-card {
  .v-tabs.v-tabs-pill {
    .v-slide-group-item--active.v-tab--selected.text-primary {
      h6 {
        color: #fff !important;
      }
    }
  }

  .v-radio-group,
  .v-checkbox {
    .v-selection-control {
      align-items: start !important;
    }

    .v-label.custom-input {
      border: none !important;
    }
  }
}
</style>
