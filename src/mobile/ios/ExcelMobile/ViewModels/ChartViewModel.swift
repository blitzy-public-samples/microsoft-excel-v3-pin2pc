import Foundation
import Combine

// Import the Chart model and ChartingEngine service
// Assuming these are defined in separate files
import Chart
import ChartingEngine

// Import CHART_TYPES from the shared constants
import AppConstants

class ChartViewModel: ObservableObject {
    @Published var charts: [Chart] = []
    private let chartingEngine: ChartingEngine
    
    init() {
        self.charts = []
        self.chartingEngine = ChartingEngine()
    }
    
    func createChart(type: CHART_TYPES, title: String, labels: [String], data: [[Double]]) -> Chart {
        let newChart = chartingEngine.createChart(type: type, title: title, labels: labels, data: data)
        charts.append(newChart)
        return newChart
    }
    
    func updateChart(chartId: String, labels: [String], data: [[Double]]) -> Bool {
        let result = chartingEngine.updateChart(chartId: chartId, labels: labels, data: data)
        if result {
            if let index = charts.firstIndex(where: { $0.id == chartId }) {
                charts[index] = chartingEngine.getChartData(chartId: chartId)!
            }
        }
        return result
    }
    
    func deleteChart(chartId: String) -> Bool {
        let result = chartingEngine.deleteChart(chartId: chartId)
        if result {
            charts.removeAll { $0.id == chartId }
        }
        return result
    }
    
    func getChartData(chartId: String) -> Chart? {
        return charts.first { $0.id == chartId }
    }
    
    func renderChart(chartId: String, frame: CGRect) -> UIView? {
        return chartingEngine.renderChart(chartId: chartId, frame: frame)
    }
    
    func exportChartAsImage(chartId: String, size: CGSize) -> UIImage? {
        return chartingEngine.exportChartAsImage(chartId: chartId, size: size)
    }
}

// MARK: - Human Tasks
/*
 TODO: Implement error handling and user feedback for chart operations (Required)
 TODO: Add support for undo/redo operations on chart modifications (Optional)
 TODO: Implement caching mechanism for rendered charts to improve performance (Optional)
 TODO: Add support for real-time updates of chart data (Required)
*/