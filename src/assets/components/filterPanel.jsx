import Star from "./stars";

export function FilterPanel({
	platformFilter,
	setPlatformFilter,
	companiesFilter,
	setCompaniesFilter,
	categoriesFilter,
	setCategoriesFilter,
	statusFilter,
	setStatusFilter,
	ratingsFilter,
	setRatingsFilter,
})

{
	// Handler for platform radio buttons
	const handlePlatformChange = (e) => {
		setPlatformFilter(e.target.value);
		console.log(`Selected Platform: ${platformFilter}`);
	};

	// Handlers for company, category, status, and rating checkbox changes
	const handleCompanyChange = (e) => {
		const value = e.target.value;
		setCompaniesFilter(prevSelected =>
		prevSelected.includes(value)
			? prevSelected.filter(company => company !== value)
			: [...prevSelected, value]
		);
		console.log(`Selected Categories: ${companiesFilter.join(', ')}`);
	};

	const handleCategoryChange = (e) => {
		const value = e.target.value;
		setCategoriesFilter(prevSelected =>
		prevSelected.includes(value)
			? prevSelected.filter(category => category !== value)
			: [...prevSelected, value]
		);
		console.log(`Selected Categories: ${categoriesFilter.join(', ')}`);
	};

	const handleStatusChange = (e) => {
		const value = e.target.value;
		setStatusFilter(Selected =>
		Selected.includes(value)
			? Selected.filter(status => status !== value)
			: [...Selected, value]
		);
		console.log(`Selected Status: ${statusFilter.join(', ')}`);
	};

	const handleRatingChange = (e) => {
	const value = parseInt(e.target.value, 10)
	setRatingsFilter(prevSelected =>
		prevSelected.includes(value)
		? prevSelected.filter(rating => rating !== value)
		: [...prevSelected, value]
		);
	};

	return (
	<>
		<div>
		<div className="px-4 mb-4">
		<div className="text-lg font-semibold mb-4">Platform</div>
		{/* Assuming 'platforms' is an array of platforms passed as a prop */}
		{['All', 'Website', 'Desktop', 'Mobile'].map((platform) => (
			<div className="flex items-center" key={platform}>
			<input
				type="radio"
				name="radio-platform"
				value={platform}
				className="radio radio-primary radio-sm"
				checked={platformFilter === platform}
				onChange={handlePlatformChange}
			/>
			<span>&emsp;{platform}</span>
			</div>
		))}
		</div>

		<div className="px-4 mb-4">
		<div className="text-lg font-semibold mb-4">Company</div>
		{/* Similar mapping for companies */}
		{['SISI', 'SBI', 'PP', 'ADHI', 'UTSG'].map((company) => (
			<div className="flex items-center" key={company}>
			<input
				type="checkbox"
				name="checkbox-status"
				className="checkbox checkbox-sm checkbox-primary"
				value={company}
				checked={companiesFilter.includes(company)}
				onChange={handleCompanyChange}
			/>
			<span>&emsp;{company}</span>
			</div>
		))}
		</div>

		<div className="px-4 mb-4">
		<div className="text-lg font-semibold mb-4">Categories</div>
		{/* Similar mapping for categories */}
		{['SAP', 'Non SAP', 'Turunan', 'OT/IT', 'Collaboration'].map((category) => (
			<div className="flex items-center" key={category}>
			<input
				type="checkbox"
				name="checkbox-status"
				className="checkbox checkbox-sm checkbox-primary"
				value={category}
				checked={categoriesFilter.includes(category)}
				onChange={handleCategoryChange}
			/>
			<span>&emsp;{category}</span>
			</div>
		))}
		</div>

		<div className="px-4 mb-4">
		<div className="text-lg font-semibold mb-4">Status</div>
		{/* Similar mapping for status */}
		{['UP', 'DOWN', 'Maintenance'].map((status) => (
			<div className="flex items-center" key={status}>
			<input
				type="checkbox"
				name="checkbox-status"
				value={status}  
				className="checkbox checkbox-sm checkbox-primary"
				checked={statusFilter.includes(status)}
				onChange={handleStatusChange}
			/>
			<span>&emsp;{status}</span>
			</div>
		))}
		</div>

		<div className="px-4 mb-4">
		<div className="text-lg font-semibold mb-4">Ratings</div>
		{[5, 4, 3, 2, 1].map((rating) => (
			<div className="flex items-center" key={rating}>
			<input
				type="checkbox"
				name="checkbox-ratings"
				value={rating}
				className="checkbox checkbox-sm checkbox-primary"
				checked={ratingsFilter.includes(rating)}
				onChange={handleRatingChange}
			/>
			&emsp;{[...Array(rating)].map((_, i) => (
				<Star isFilled={true} key={i} />
			))}&nbsp;{rating}
			</div>
		))}
		</div>
	</div>

	</>
	);
}