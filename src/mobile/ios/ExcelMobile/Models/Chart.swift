import Foundation

// MARK: - Chart Types
// TODO: Update this enum to match the actual CHART_TYPES from AppConstants when available
enum CHART_TYPES: String, Codable {
    case bar
    case line
    case pie
    case scatter
    // Add other chart types as needed
}

// MARK: - Dataset
struct Dataset: Codable {
    let label: String
    let data: [Double]
    
    init(label: String, data: [Double]) {
        self.label = label
        self.data = data
    }
}

// MARK: - Chart
struct Chart: Codable {
    let id: String
    let type: CHART_TYPES
    let title: String
    let labels: [String]
    let datasets: [Dataset]
    
    init(id: String, type: CHART_TYPES, title: String, labels: [String], datasets: [Dataset]) {
        self.id = id
        self.type = type
        self.title = title
        self.labels = labels
        self.datasets = datasets
    }
    
    // MARK: - JSON Conversion
    func toJSON() throws -> Data {
        let encoder = JSONEncoder()
        return try encoder.encode(self)
    }
    
    static func fromJSON(_ jsonData: Data) throws -> Chart? {
        let decoder = JSONDecoder()
        return try decoder.decode(Chart.self, from: jsonData)
    }
}

// MARK: - Human Tasks
/*
 TODO: Implement chart rendering logic specific to iOS (Required)
 TODO: Ensure compatibility with different iOS screen sizes and orientations (Required)
 TODO: Optimize chart performance for large datasets on iOS devices (Optional)
*/