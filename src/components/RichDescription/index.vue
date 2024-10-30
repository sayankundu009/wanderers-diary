<template>
  <p class="whitespace-pre-wrap break-all">
    <template v-for="(segment, index) in processedText" :key="index">
      <span v-if="segment.type === 'phone'" class="text-primary cursor-pointer hover:underline" @click="copyToClipboard(segment.text)" :data-tooltip-id="'phone-' + index">
        {{ segment.text }}
        <div v-if="copiedIndex === index" class="tooltip tooltip-open" :data-tip="'Copied!'"></div>
      </span>

      <a v-else-if="segment.type === 'url'" :href="segment.text" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
        {{ segment.title || segment.text }}
      </a>

      <span v-else>{{ segment.text }}</span>
    </template>
  </p>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});

const copiedIndex = ref(null);

const patterns = {
  phone: /(\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g,
  url: /(https?:\/\/[^\s]+)/g,
};

const urlTitles = ref({});

const processedText = computed(() => {
  let segments = [{ type: "text", text: props.text }];

  segments = processSegments(segments, patterns.url, "url");
  segments = processSegments(segments, patterns.phone, "phone");

  console.log(segments);

  return segments;
});

function processSegments(segments, pattern, type) {
  let result = [];

  segments.forEach((segment) => {
    if (segment.type !== "text") {
      result.push(segment);
      return;
    }

    let lastIndex = 0;
    let text = segment.text;
    let matches = [...text.matchAll(pattern)];

    for (let match of matches) {
      if (match.index > lastIndex) {
        result.push({
          type: "text",
          text: text.slice(lastIndex, match.index),
        });
      }
      result.push({
        type,
        text: match[0],
        title: type === "url" ? urlTitles.value[match[0]] : undefined,
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      result.push({
        type: "text",
        text: text.slice(lastIndex),
      });
    }
  });

  return result;
}

async function fetchUrlTitle(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const match = html.match(/<title>(.*?)<\/title>/i);
    return match ? match[1] : null;
  } catch (error) {
    console.error(`Error fetching title for ${url}:`, error);
    return null;
  }
}

watch(
  processedText,
  async (segments) => {
    const urlSegments = segments.filter((segment) => segment.type === "url");
    for (const segment of urlSegments) {
      if (!urlTitles.value[segment.text]) {
        const title = await fetchUrlTitle(segment.text);
        if (title) {
          urlTitles.value[segment.text] = title;
        }
      }
    }
  },
  { immediate: true },
);

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    const index = processedText.value.findIndex((segment) => segment.type === "phone" && segment.text === text);
    copiedIndex.value = index;
    setTimeout(() => {
      copiedIndex.value = null;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
}
</script>
