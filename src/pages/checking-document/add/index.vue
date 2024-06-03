<script setup lang="ts">
import { ref } from 'vue'

const optionCounter = ref(1)

const dropZoneRef = ref<HTMLDivElement>()
interface FileData {
  file: File
  url: string
}

const fileData = ref<FileData[]>([])
const { onChange } = useFileDialog({ accept: 'image/*' })

function onDrop(DroppedFiles: File[] | null) {
  DroppedFiles?.forEach(file => {
    if (file.type.slice(0, 6) !== 'image/') {
      // eslint-disable-next-line no-alert
      alert('Only image files are allowed')

      return
    }

    fileData.value.push({
      file,
      url: useObjectUrl(file).value ?? '',
    })
  },
  )
}

onChange(selectedFiles => {
  if (!selectedFiles)
    return

  for (const file of selectedFiles) {
    fileData.value.push({
      file,
      url: useObjectUrl(file).value ?? '',
    })
  }
})

useDropZone(dropZoneRef, onDrop)

const content = ref(
  `<p>
    Keep your account secure with authentication step.
    </p>`)

const activeTab = ref('Restock')
const isTaxChargeToProduct = ref(true)

const shippingList = [
  { desc: 'You\'ll be responsible for product delivery.Any damage or delay during shipping may cost you a Damage fee', title: 'Fulfilled by Seller', value: 'Fulfilled by Seller' },
  { desc: 'Your product, Our responsibility.For a measly fee, we will handle the delivery process for you.', title: 'Fulfilled by Company name', value: 'Fulfilled by Company name' },
] as const

const shippingType = ref<typeof shippingList[number]['value']>('Fulfilled by Company name')
const deliveryType = ref('Worldwide delivery')
const selectedAttrs = ref(['Biodegradable', 'Expiry Date'])

const inventoryTabsData = [
  { icon: 'tabler-cube', title: 'Restock', value: 'Restock' },
  { icon: 'tabler-car', title: 'Shipping', value: 'Shipping' },
  { icon: 'tabler-map-pin', title: 'Global Delivery', value: 'Global Delivery' },
  { icon: 'tabler-world', title: 'Attributes', value: 'Attributes' },
  { icon: 'tabler-lock', title: 'Advanced', value: 'Advanced' },
]
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Add a new product
        </h4>
        <div class="text-body-1">
          Orders placed across your store
        </div>
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
        <VBtn
          variant="tonal"
          color="secondary"
        >
          Discard
        </VBtn>
        <VBtn
          variant="tonal"
          color="primary"
        >
          Save Draft
        </VBtn>
        <VBtn>Publish Product</VBtn>
      </div>
    </div>

    <VRow>
      <VCol md="8">
        <!-- 👉 Product Information -->
        <VCard
          class="mb-6"
          title="Product Information"
        >
          <VCardText>
            <VRow>
              <VCol cols="12">
                <AppTextField
                  label="Name"
                  placeholder="iPhone 14"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  label="SKU"
                  placeholder="FXSK123U"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  label="Barcode"
                  placeholder="0123-4567"
                />
              </VCol>
              <VCol>
                <span class="mb-1">Description (optional)</span>
                <ProductDescriptionEditor
                  v-model="content"
                  placeholder="Product Description"
                  class="border rounded"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- 👉 Media -->
        <VCard class="mb-6">
          <VCardItem>
            <template #title>
              Product Image
            </template>
            <template #append>
              <span class="text-primary font-weight-medium text-sm cursor-pointer">Add Media from URL</span>
            </template>
          </VCardItem>

          <VCardText>
            <DropZone />
          </VCardText>
        </VCard>

      </VCol>

      <VCol
        md="4"
        cols="12"
      >
        <!-- 👉 Pricing -->
        <VCard
          title="Pricing"
          class="mb-6"
        >
          <VCardText>
            <AppTextField
              label="Best Price"
              placeholder="Price"
              class="mb-6"
            />
            <AppTextField
              label="Discounted Price"
              placeholder="$499"
              class="mb-6"
            />

            <VCheckbox
              v-model="isTaxChargeToProduct"
              label="Charge Tax on this product"
            />

            <VDivider class="my-2" />

            <div class="d-flex flex-raw align-center justify-space-between ">
              <span>In stock</span>
              <VSwitch density="compact" />
            </div>
          </VCardText>
        </VCard>

        <!-- 👉 Organize -->
        <VCard title="Organize">
          <VCardText>
            <div class="d-flex flex-column gap-y-4">
              <AppSelect
                placeholder="Select Vendor"
                label="Vendor"
                :items="['Men\'s Clothing', 'Women\'s Clothing', 'Kid\'s Clothing']"
              />
              <div>
                <VLabel class="d-flex">
                  <div class="d-flex text-sm justify-space-between w-100">
                    <div class="text-high-emphasis">
                      Category
                    </div>
                  </div>
                </VLabel>

                <div class="d-flex gap-x-4">
                  <AppSelect
                    placeholder="Select Category"
                    :items="['Household', 'Office', 'Electronics', 'Management', 'Automotive']"
                  />
                  <VBtn
                    rounded
                    icon="tabler-plus"
                    variant="tonal"
                  />
                </div>
              </div>
              <AppSelect
                placeholder="Select Collection"
                label="Collection"
                :items="['Men\'s Clothing', 'Women\'s Clothing', 'Kid\'s Clothing']"
              />
              <AppSelect
                placeholder="Select Status"
                label="Status"
                :items="['Published', 'Inactive', 'Scheduled']"
              />
              <AppTextField
                label="Tags"
                placeholder="Fashion, Trending, Summer"
              />
            </div>
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
