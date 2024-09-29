using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;

namespace ExcelDesktop.Models
{
    /// <summary>
    /// Represents an Excel-like spreadsheet workbook containing multiple worksheets and workbook-level properties.
    /// </summary>
    public class Workbook : INotifyPropertyChanged
    {
        private string _name;
        private string _author;
        private DateTime _createdDate;
        private DateTime _modifiedDate;
        private bool _isModified;
        private string _filePath;

        public event PropertyChangedEventHandler PropertyChanged;

        /// <summary>
        /// Gets or sets the name of the workbook.
        /// </summary>
        public string Name
        {
            get => _name;
            set
            {
                if (_name != value)
                {
                    _name = value;
                    OnPropertyChanged(nameof(Name));
                    IsModified = true;
                }
            }
        }

        /// <summary>
        /// Gets or sets the list of worksheets in the workbook.
        /// </summary>
        public List<Worksheet> Worksheets { get; set; }

        /// <summary>
        /// Gets or sets the author of the workbook.
        /// </summary>
        public string Author
        {
            get => _author;
            set
            {
                if (_author != value)
                {
                    _author = value;
                    OnPropertyChanged(nameof(Author));
                    IsModified = true;
                }
            }
        }

        /// <summary>
        /// Gets or sets the creation date of the workbook.
        /// </summary>
        public DateTime CreatedDate
        {
            get => _createdDate;
            set
            {
                if (_createdDate != value)
                {
                    _createdDate = value;
                    OnPropertyChanged(nameof(CreatedDate));
                }
            }
        }

        /// <summary>
        /// Gets or sets the last modified date of the workbook.
        /// </summary>
        public DateTime ModifiedDate
        {
            get => _modifiedDate;
            set
            {
                if (_modifiedDate != value)
                {
                    _modifiedDate = value;
                    OnPropertyChanged(nameof(ModifiedDate));
                }
            }
        }

        /// <summary>
        /// Gets or sets a value indicating whether the workbook has been modified since the last save.
        /// </summary>
        public bool IsModified
        {
            get => _isModified;
            set
            {
                if (_isModified != value)
                {
                    _isModified = value;
                    OnPropertyChanged(nameof(IsModified));
                }
            }
        }

        /// <summary>
        /// Gets or sets the file path of the workbook.
        /// </summary>
        public string FilePath
        {
            get => _filePath;
            set
            {
                if (_filePath != value)
                {
                    _filePath = value;
                    OnPropertyChanged(nameof(FilePath));
                }
            }
        }

        /// <summary>
        /// Gets or sets the file I/O service for the workbook.
        /// </summary>
        public IFileIOService FileIOService { get; set; }

        /// <summary>
        /// Gets or sets the data sync service for the workbook.
        /// </summary>
        public IDataSyncService DataSyncService { get; set; }

        /// <summary>
        /// Initializes a new instance of the Workbook class with a given name.
        /// </summary>
        /// <param name="name">The name of the workbook.</param>
        /// <param name="fileIOService">The file I/O service to use.</param>
        /// <param name="dataSyncService">The data sync service to use.</param>
        public Workbook(string name, IFileIOService fileIOService, IDataSyncService dataSyncService)
        {
            Name = name;
            Worksheets = new List<Worksheet>();
            Author = Environment.UserName;
            CreatedDate = DateTime.Now;
            ModifiedDate = DateTime.Now;
            IsModified = false;
            FilePath = null;
            FileIOService = fileIOService;
            DataSyncService = dataSyncService;

            // Create a default worksheet and add it to the Worksheets list
            AddWorksheet("Sheet1");
        }

        /// <summary>
        /// Adds a new worksheet to the workbook.
        /// </summary>
        /// <param name="name">The name of the new worksheet.</param>
        /// <returns>The newly created worksheet.</returns>
        public Worksheet AddWorksheet(string name)
        {
            var newWorksheet = new Worksheet(name);
            Worksheets.Add(newWorksheet);
            IsModified = true;
            return newWorksheet;
        }

        /// <summary>
        /// Removes a worksheet from the workbook.
        /// </summary>
        /// <param name="worksheet">The worksheet to remove.</param>
        /// <returns>True if the worksheet was successfully removed, false otherwise.</returns>
        public bool RemoveWorksheet(Worksheet worksheet)
        {
            bool removed = Worksheets.Remove(worksheet);
            if (removed)
            {
                IsModified = true;
            }
            return removed;
        }

        /// <summary>
        /// Asynchronously saves the workbook to a file.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public async Task SaveAsync()
        {
            if (string.IsNullOrEmpty(FilePath))
            {
                throw new InvalidOperationException("FilePath is not set. Use SaveAsAsync to specify a file path.");
            }

            await FileIOService.SaveWorkbookAsync(this, FilePath);
            IsModified = false;
            ModifiedDate = DateTime.Now;
        }

        /// <summary>
        /// Asynchronously saves the workbook to a new file.
        /// </summary>
        /// <param name="filePath">The file path to save the workbook to.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public async Task SaveAsAsync(string filePath)
        {
            await FileIOService.SaveWorkbookAsync(this, filePath);
            FilePath = filePath;
            IsModified = false;
            ModifiedDate = DateTime.Now;
        }

        /// <summary>
        /// Asynchronously synchronizes the workbook with cloud storage.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation, returning true if sync was successful.</returns>
        public async Task<bool> SyncAsync()
        {
            bool syncResult = await DataSyncService.SyncWorkbook(this);
            if (syncResult)
            {
                ModifiedDate = DateTime.Now;
            }
            return syncResult;
        }

        /// <summary>
        /// Recalculates all cells in all worksheets of the workbook.
        /// </summary>
        public void RecalculateAll()
        {
            foreach (var worksheet in Worksheets)
            {
                worksheet.Recalculate();
            }
        }

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}