import { Component } from "react"
import * as net from "./net"
import { DataGrid } from '@mui/x-data-grid';
import * as utils from "./utils"
import Chip from "@mui/material/Chip"
import { ImHappy } from "react-icons/im"
import { ImSad } from "react-icons/im"

export default class DataTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      datagrid: {
        products: [],
        isLoading: false,
      },
      pagination: {
        rowCount: 0,
        page: 0,
        pageSize: 5,
      }
    }
  }

  setProducts(products) {
    this.setObjectState("datagrid", { products })
  }

  setIsLoading(isLoading) {
    this.setObjectState("datagrid", { isLoading })
  }

  setRowCount(rowCount) {
    this.setObjectState("pagination", { rowCount })
  }

  setPageAndLoadData(page) {
    this.setObjectState("pagination", { page })
    this.loadData({ page })
  }

  setPageSizeAndLoadData(pageSize) {
    this.setObjectState("pagination", { pageSize })
    this.loadData({ pageSize })
  }

  componentDidMount() {
    const { page, pageSize } = this.state.datagrid;
    this.loadData({ page, pageSize });
  }

  setObjectState(objectName, properties) {
    this.setState(prevState => {
      for (const key in properties)
        prevState[objectName][key] = properties[key]
      return {
        [objectName]: prevState[objectName]
      }
    })
  }

  buildCols() {
    const valuePriceFormatter = ({ value }) => utils.priceFormatter(value);
    const valueDateformatter = ({ value }) => utils.dateFormatter(value);

    const columns = [
      {
        field: "description",
        type: "string",
        headerName: "Description",
      },
      {
        field: "sequenceCode",
        type: "number",
        headerName: "Sequence Code",
        valueFormatter: null,
      },
      {
        field: "barcode",
        type: "string",
        headerName: "Barcode",
      },
      {
        field: "currentPrice",
        type: "number",
        headerName: "Current Price",
        valueFormatter: valuePriceFormatter,
      },
      {
        field: "currentPriceDate",
        type: "string",
        headerName: "Current Price Date",
        valueFormatter: valueDateformatter,
      },
      {
        field: "previousPrice",
        type: "number",
        headerName: "Previous Price",
        valueFormatter: valuePriceFormatter,
      },
      {
        field: "previousPriceDate",
        type: "string",
        headerName: "Previous Price Date",
        valueFormatter: valueDateformatter,
      },
      {
        field: "priceDifference",
        type: "number",
        headerName: "Price difference",
        renderCell: ({ value }) => {
          if (!value) return null;

          const settings = {
            label:  utils.priceFormatter(value),
            color:  "success",
            icon:  <ImHappy className="text-xl"/>,
          }

          if (value > 0) {
            settings.color = "error",
            settings.icon = <ImSad className="text-xl"/> 
          }
    
          return <Chip label={settings.label} variant="outlined" color={settings.color} icon={settings.icon}/>;
        }
      },
    ];

    for (const col of columns) {
      col.headerAlign = "left"
      col.align = "left"
      col.width = col.field === "description" ? 300 : 150
    }

    return columns;
  }

  buildRows() {
    return this.state.datagrid.products.map((value, index) => {
      return {
        id: index + 1,
        description: value.description,
        sequenceCode: value.sequenceCode,
        barcode: value.barcode,
        currentPrice: value.currentPrice,
        currentPriceDate: value.currentPriceDate,
        previousPrice: value.previousPrice,
        previousPriceDate: value.previousPriceDate,
        priceDifference: value.priceDifference,
      }
    });
  }

  handlePageChange(page) {
    this.loadPage({ page })
  }

  handlePageSizeChange(pageSize) {
    this.loadPage({ pageSize })
  }
  
  loadData(pagination) {
    this.setIsLoading(true)

    const {
      page = this.state.pagination.page,
      pageSize = this.state.pagination.pageSize,
    } = pagination

    net.getPagedProducts({ page, pageSize })
      .then(({ products, rowCount }) => {
        this.setProducts(products);
        this.setIsLoading(false);
        this.setRowCount(rowCount)
      })
      .catch(console.error)
  }

  render() {
    return (
      <DataGrid
        columns={this.buildCols()}
        rows={this.buildRows()}
        initialState={{
          sorting: {
            sortModel: [{ field: "description", sort: "asc" }]
          }
        }}
        rowsPerPageOptions={[5, 10, 15, 20, 30]}
        onPageChange={this.setPageAndLoadData.bind(this)}
        onPageSizeChange={this.setPageSizeAndLoadData.bind(this)}
        page={this.state.pagination.page}
        pageSize={this.state.pagination.pageSize}
        pagination={true}
        paginationMode="server"
        rowCount={this.state.pagination.rowCount}
        loading={this.state.datagrid.isLoading}
        getRowClassName={_ => "hover:text-purple-700"}
      />
    )
  }
}