<script setup>
import { ref, onMounted } from 'vue';
import DataTable from '@/components/DataTable.vue';

const data = ref([]);

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/pdfs');
    data.value = await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Error fetching data from server');
  }
};
 onMounted(async () => {
  fetchData();
});
</script>
<template>
    <section id="pdf-wrapper">
      <DataTable v-if="data.length > 0" :data="data" />
    </section>
</template>

<style>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column; /* Stack button and table vertically */
}

#pdf-wrapper {
  padding: 20px 10px;
}

#pdf-wrapper thead {
  border-radius: 10px 10px 0 0;
}

#pdf-wrapper th {
  background: #95ffc3;
}

.fetch-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 16px;
  border-radius: 5px;
}

.fetch-button:hover {
  background-color: #45a049;
}

</style>