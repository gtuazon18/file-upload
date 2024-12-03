<template>
  <div>
    <DataTable :value="paginatedData" stripedRows selectionMode="single" :paginator="true" :rows="rowsPerPage" :currentPageReportTemplate="`Showing {first} to {last} of {totalRecords}`" :totalRecords="filteredData.length" :lazy="true" @page="onPageChange">
      <Column field="id" header="ID" />
      <Column field="doctorName" header="Doctor's Name" :body="renderNullValue" />
      <Column field="expiryDate" header="Expiry Date" :body="renderNullValue" />
      <Column field="mapNumber" header="MAP Number" :body="renderNullValue" />
      <Column field="mbNumber" header="MB Number" :body="renderNullValue" />
      <Column field="productType" header="Product Type" :body="renderNullValue" />
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const rowsPerPage = ref(10);
const currentPage = ref(1);

const filteredData = computed(() => props.data || []);

const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage.value;
  return filteredData.value.slice(startIndex, startIndex + rowsPerPage.value);
});

const onPageChange = (event) => {
  currentPage.value = event.page + 1; 
};

const renderNullValue = (rowData) => {
  return rowData ? rowData : null;
};
</script>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
}
</style>
