<script setup lang="ts">
import { postCheckingDocument } from "@/services/checking_document.service";
import { uploadCheckingSentence } from "@/services/checking_sentence.service";
import { ref } from "vue";

const optionCounter = ref(1);

const dropZoneRef = ref<HTMLDivElement>();
interface FileData {
  file: File;
  url: string;
}

const rules = [
  (fileList: FileList) =>
    !fileList ||
    !fileList.length ||
    fileList[0].size < 1000000 ||
    "Avatar size should be less than 1 MB!",
];
const fileData = ref<FileData[]>([]);
const { onChange } = useFileDialog({ accept: "image/*" });

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

const description = ref("");
const file = ref<any>();
const title = ref("");
const course = ref("");
const actionType = ref("");

const setAction = (action: any) => {
  actionType.value = action;
};

const createCheckingDocument = async () => {
  const formData = new FormData();

  formData.append("file", file.value[0]);
  formData.append("description", description.value);
  formData.append("title", title.value);
  formData.append("course", course.value);

  if (actionType.value === "add") {
    postCheckingDocument(formData)
      .then((res: any) => {
        if (res.status !== "error") {
          showMessage("Tạo mới tài liệu thành công!", "success");
          window.location.replace("/checking-document/list");
        } else {
          showMessage("Tạo mới tài liệu thất bại!", "error");
        }
      })
      .catch((error) => {
        showMessage("Có lỗi xảy ra!", "error");
      });
  } else {
    uploadCheckingSentence(formData)
      .then((res: any) => {
        if (res.status !== "error") {
          showMessage("Tách câu tài liệu thành công!", "success");
          window.location.replace("/checking-document/list");
        } else {
          showMessage("Tách câu tài liệu thất bại!", "error");
        }
      })
      .catch((error) => {
        showMessage("Có lỗi xảy ra!", "error");
      });
  }

  // fetchInvoices()
};
</script>

<template>
  <div>
    <div
      class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6"
    >
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">Thêm tài liệu</h4>
      </div>
    </div>

    <VRow>
      <VCol md="12">
        <!-- 👉 Product Information -->
        <VCard class="mb-6" title="Thông tin tài liệu">
          <VCardText>
            <VForm
              @submit.prevent="
                (e) => {
                  createCheckingDocument();
                }
              "
            >
              <VRow>
                <VCol cols="12">
                  <VTextField
                    v-model="title"
                    label="Tiêu đề"
                    placeholder="Nhập tiêu đề"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="course"
                    label="Tên khóa học"
                    placeholder="Nhập khóa học"
                  />
                </VCol>

                <VCol cols="12">
                  <VFileInput
                    v-model="file"
                    :rules="[requiredValidator, ...rules]"
                    label="File"
                    accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    placeholder="Pick an avatar"
                  />
                </VCol>
                <VCol cols="12">
                  <AppTextarea
                    v-model="description"
                    label="Mô tả"
                    placeholder="Nhập mô tả"
                  />
                </VCol>
                <VCol cols="12" class="d-flex gap-4">
                  <VBtn type="submit" @click="setAction('add')">
                    Thêm mới
                  </VBtn>
                  <VBtn type="submit" color="success" @click="setAction('extract')">
                    Tách câu
                  </VBtn>

                  <VBtn type="reset" color="secondary" variant="tonal">
                    Khôi phục dữ liệu
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
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
