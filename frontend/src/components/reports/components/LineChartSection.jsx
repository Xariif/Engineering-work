import React, { useMemo } from "react";
import { Box, Typography, useTheme, useMediaQuery, alpha, Card, CardContent, Divider } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { ChartsTooltip } from "@mui/x-charts";

const LineChartSection = ({ data, title = "Performance Over Time" }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	// Define a set of distinct, visually appealing colors for charts
	const chartColors = useMemo(() => [
		'#1f77b4', // Blue
		'#ff7f0e', // Orange
		'#2ca02c', // Green
		'#d62728', // Red
		'#9467bd', // Purple
		'#8c564b', // Brown
		'#e377c2', // Pink
		'#7f7f7f', // Gray
		'#bcbd22', // Olive
		'#17becf'  // Teal
	], []);
	
	// Assign colors to series
	const getSeriesColors = useMemo(() => {
		const colorMap = {};
		
		if (data && data.series) {
			data.series.forEach((series, index) => {
				// Cycle through colors if there are more series than colors
				colorMap[series.name] = chartColors[index % chartColors.length];
			});
		}
		
		return colorMap;
	}, [data, chartColors]);

	// Format the data to match the LineChart component requirements
	const chartData = useMemo(() => {
		if (!data) return { xAxis: [], series: [] };

		// If we have the data in the format with labels and series
		if (data.labels && data.series) {
			// Prepare series in the format expected by MUI X-Charts
			const formattedSeries = data.series.map((item) => {
				return {
					data: item.data,
					valueFormatter: (value) => new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "EUR",
						minimumFractionDigits: 2
					}).format(value),
					label: item.name,
					color: getSeriesColors[item.name],
					showMark: true,
					curve: "natural",
					lineWidth: item.name === "Total Mall Turnover" ? 4 : 3
				};
			});

			// Move Total Mall Turnover to be drawn first (underneath)
			const totalIndex = formattedSeries.findIndex((s) => s.label === "Total Mall Turnover");
			if (totalIndex > -1) {
				const totalSeries = formattedSeries.splice(totalIndex, 1)[0];
				formattedSeries.unshift(totalSeries);
			}

			return {
				xAxis: [
					{
						scaleType: "band",
						data: data.labels,
						label: data?.xAxisLabel || "Time Period",
						tickLabelStyle: {
							fontSize: 12,
						},
                        labelStyle: {
                            transform: 'translateY(-10px)'
                        },
					}
				],
				series: formattedSeries
			};
		}

		return { xAxis: [], series: [] };
	}, [data, getSeriesColors]);

	const formatValue = (value) => {
		if (value >= 1000000) {
			return `${(value / 1000000).toFixed(2)}M`;
		} else if (value >= 1000) {
			return `${(value / 1000).toFixed(1)}k`;
		}
		return value.toFixed(2);
	};

	// Custom tooltip formatter
	const tooltipFormatter = (params) => {
		if (!params.length) return { title: "", content: [] };

		const itemIndex = params[0].itemIndex;
		const itemLabel = data?.labels?.[itemIndex] || `Period ${itemIndex + 1}`;

		// Find the total turnover value for this period if it exists
		let totalValue = null;
		const totalSeries = chartData.series?.find((s) => s.label === "Total Mall Turnover");
		if (totalSeries) {
			totalValue = totalSeries.data[itemIndex];
		}

		// Sort params by value in descending order for better readability
		const sortedParams = [...params].sort((a, b) => b.value - a.value);

		return {
			title: itemLabel,
			content: sortedParams.map((param) => {
				// Get the original series name from the data
				let seriesName = param.series.label || "Unknown";

				// Format the value with currency
				const formattedValue = new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "EUR",
					minimumFractionDigits: 2
				}).format(param.value);

				// Calculate percentage of total if total exists and this isn't the total itself
				let percentageInfo = "";
				if (totalValue && seriesName !== "Total Mall Turnover") {
					const percentage = ((param.value / totalValue) * 100).toFixed(1);
					percentageInfo = ` (${percentage}%)`;
				}

				return {
					name: seriesName,
					color: param.series.color,
					value: `${formattedValue}${percentageInfo}`
				};
			})
		};
	};

	

	return (
		<Card
			elevation={2}
			sx={{
				borderRadius: 2,
				overflow: "hidden",
				backgroundColor: theme.palette.background.paper,
				transition: "all 0.3s ease-in-out",
				"&:hover": {
					boxShadow: theme.shadows[8],
					transform: "translateY(-4px)"
				}
			}}
		>
			<CardContent>
				<Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
					{title}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
					{data?.description || "Visualizing trends and patterns over the selected time period"}
				</Typography>
				<Divider sx={{ mb: 3 }} />
				<Box
					sx={{
						width: "100%",
						height: 500,
						display: "flex",
						justifyContent: "center",
						overflow: "hidden"
					}}
				>
					<LineChart
						xAxis={[
							{
								scaleType: "band",
								data: data?.labels || [],
								label: data?.xAxisLabel || "Time Period",
								tickLabelStyle: {
									angle: 45,
									textAnchor: "start",
									fontSize: 12
								},
                                labelStyle: {
                                    transform: 'translateY(30px)'
                                },
								tickLabelPlacement: "middle"
							}
						]}
						yAxis={[
							{
								label: data?.yAxisLabel || "Turnover (EUR)",
						
							
								valueFormatter: formatValue
							}
						]}
						series={chartData.series || []}
			
                        slotProps={{
                            legend: {
                                position: {
                                    vertical: 'top',
                                    horizontal: 'middle',
                                },
                                labelStyle: {
                                    fontSize: 12,
                                },
                                itemGap: 10
                            },
                            bar: {
                                borderRadius: 4,
                                paddingInner: 0.5,
                                paddingOuter: 0.3,
                            }
                        }}
						margin={{
							left: 80,
							right: 20,
							top: 50,
							bottom: 80
						}}
						tooltip={{
							trigger: "item",
							formatter: tooltipFormatter
						}}
					>
						<ChartsTooltip
							sx={{
								backgroundColor: alpha(theme.palette.background.paper, 0.95),
								borderRadius: 1,
								boxShadow: theme.shadows[4],
								border: `1px solid ${theme.palette.divider}`,
								padding: 1.5,
								"& .MuiChartsTooltip-table": {
									fontSize: 13
								},
								"& .MuiChartsTooltip-title": {
									fontWeight: "bold",
									marginBottom: 1,
									fontSize: "14px",
									color: theme.palette.text.primary,
									borderBottom: `1px solid ${theme.palette.divider}`,
									paddingBottom: "6px"
								},
								"& .MuiChartsTooltip-cell": {
									padding: "4px 8px"
								},
								"& .MuiChartsTooltip-color": {
									width: 12,
									height: 12,
									marginRight: 1,
									borderRadius: "50%"
								},
								"& .MuiChartsTooltip-name": {
									fontWeight: 500,
									paddingRight: 2
								},
								"& .MuiChartsTooltip-value": {
									fontWeight: 600,
									color: theme.palette.text.primary
								}
							}}
							slotProps={{
								popper: {
									sx: {
										zIndex: 2000
									}
								},
								arrow: {
									sx: {
										color: alpha(theme.palette.background.paper, 0.95),
										"&::before": {
											border: `1px solid ${theme.palette.divider}`
										}
									}
								}
							}}
						/>
					</LineChart>
				</Box>
			</CardContent>
		</Card>
	);
};

export default LineChartSection;
