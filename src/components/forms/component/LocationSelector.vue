<template>
	<div class="space-y-4">
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-dark-base mb-2"
					>Address</label
				>
				<input
					:value="currentValue.address || ''"
					type="text"
					placeholder="Address"
					:disabled="disabled"
					class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
					@input="emitValue({ address: $event.target.value })"
				/>
			</div>

			<div class="relative" ref="cityDropdownRef">
				<label class="block text-sm font-medium text-dark-base mb-2"
					>City</label
				>
				<input
					:value="citySearch"
					type="text"
					placeholder="Search City"
					:disabled="disabled"
					class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
					@focus="openCityDropdown"
					@input="onCityInput"
				/>
				<ChevronDown
					:size="16"
					class="absolute right-3 top-9.5 text-sub-text pointer-events-none"
				/>

				<div
					v-if="isCityDropdownOpen"
					class="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto border border-outline rounded-lg bg-white shadow-lg"
				>
					<button
						v-for="city in filteredCityOptions"
						:key="city.id"
						type="button"
						class="w-full text-left px-3 py-2 hover:bg-light-base text-sm"
						@click="selectCity(city)"
					>
						{{ city.name }}
					</button>
					<div
						v-if="filteredCityOptions.length === 0"
						class="px-3 py-2 text-sm text-sub-text"
					>
						No city found
					</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium text-dark-base mb-2"
					>Province</label
				>
				<div class="relative">
					<select
						:value="selectedProvinceId"
						:disabled="disabled"
						class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
						@change="onProvinceChange"
					>
						<option value="">Select Province</option>
						<option
							v-for="province in provinceOptions"
							:key="province.id"
							:value="province.id"
						>
							{{ province.name }}
						</option>
					</select>
					<ChevronDown
						:size="16"
						class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
					/>
				</div>
			</div>

			<div>
				<label class="block text-sm font-medium text-dark-base mb-2"
					>Country</label
				>
				<input
					:value="countryValue"
					type="text"
					placeholder="Country"
					:disabled="disabled"
					class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
					@input="emitValue({ country: $event.target.value })"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { ChevronDown } from "lucide-vue-next";
import provincesCsv from "idn-area-data/data/provinces.csv?raw";
import regenciesCsv from "idn-area-data/data/regencies.csv?raw";

function parseCsvRows(csvText) {
	if (!csvText || typeof csvText !== "string") return [];

	const lines = csvText
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);

	if (lines.length < 2) return [];

	const headers = lines[0].split(",").map((header) => header.trim());

	return lines.slice(1).map((line) => {
		const values = line.split(",");
		const row = {};

		headers.forEach((header, index) => {
			row[header] = (values[index] || "").trim();
		});

		return row;
	});
}

export default {
	name: "LocationSelector",

	components: {
		ChevronDown,
	},

	props: {
		value: {
			type: Object,
			default: () => ({}),
		},
		modelValue: {
			type: Object,
			default: null,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},

	emits: ["input", "update:modelValue"],

	data() {
		return {
			provincesData: [],
			regenciesData: [],
			citySearch: "",
			isCityDropdownOpen: false,
		};
	},

	computed: {
		currentValue() {
			return this.modelValue || this.value || {};
		},

		provinceOptions() {
			return (this.provincesData || []).map((province) => ({
				id: String(province.code),
				name: province.name,
			}));
		},

		selectedProvinceId() {
			const provinceName = (this.currentValue.province || "")
				.toLowerCase()
				.trim();
			if (!provinceName) return "";

			const selectedProvince = (this.provincesData || []).find(
				(province) =>
					(province.name || "").toLowerCase() === provinceName,
			);

			return selectedProvince ? String(selectedProvince.code) : "";
		},

		cityOptions() {
			return (this.regenciesData || [])
				.filter((regency) => {
					if (!this.selectedProvinceId) return true;
					return (
						String(regency.province_code) === String(this.selectedProvinceId)
					);
				})
				.map((regency) => ({
					id: String(regency.code),
					name: regency.name,
					provinceCode: String(regency.province_code),
				}));
		},

		filteredCityOptions() {
			const query = (this.citySearch || "").toLowerCase().trim();

			if (!query) {
				return this.cityOptions.slice(0, 120);
			}

			return this.cityOptions
				.filter((city) => (city.name || "").toLowerCase().includes(query))
				.slice(0, 120);
		},

		countryValue() {
			if (this.currentValue.city && String(this.currentValue.city).trim()) {
				return "Indonesia";
			}

			return this.currentValue.country || "";
		},
	},

	watch: {
		"currentValue.city": {
			immediate: true,
			handler(nextCity) {
				if (!this.isCityDropdownOpen) {
					this.citySearch = nextCity || "";
				}
			},
		},
	},

	mounted() {
		this.provincesData = parseCsvRows(provincesCsv);
		this.regenciesData = parseCsvRows(regenciesCsv);
		document.addEventListener("mousedown", this.handleClickOutside);
	},

	beforeUnmount() {
		document.removeEventListener("mousedown", this.handleClickOutside);
	},

	methods: {
		emitValue(updatedFields) {
			const nextValue = {
				...this.currentValue,
				...updatedFields,
			};

			this.$emit("input", nextValue);
			this.$emit("update:modelValue", nextValue);
		},

		onProvinceChange(event) {
			const selectedId = String(event.target.value || "");
			const selectedProvince = (this.provincesData || []).find(
				(province) => String(province.code) === selectedId,
			);

			this.emitValue({
				province: selectedProvince ? selectedProvince.name : "",
				city: "",
				country: "",
			});

			this.citySearch = "";
		},

		onCityInput(event) {
			const nextValue = event.target.value;
			this.citySearch = nextValue;
			this.isCityDropdownOpen = true;

			this.emitValue({
				city: nextValue,
				country: nextValue && nextValue.trim() ? "Indonesia" : "",
			});
		},

		openCityDropdown() {
			this.isCityDropdownOpen = true;
		},

		selectCity(city) {
			const selectedProvince = (this.provincesData || []).find(
				(province) => String(province.code) === String(city.provinceCode),
			);

			this.citySearch = city.name;
			this.isCityDropdownOpen = false;

			this.emitValue({
				city: city.name,
				province: selectedProvince
					? selectedProvince.name
					: this.currentValue.province || "",
				country: "Indonesia",
			});
		},

		handleClickOutside(event) {
			if (!this.$refs.cityDropdownRef) return;
			if (!this.$refs.cityDropdownRef.contains(event.target)) {
				this.isCityDropdownOpen = false;
			}
		},
	},
};
</script>