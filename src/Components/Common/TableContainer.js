import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  useRowSelect
} from "react-table";
import { Table, Row, Col, Button, Input, CardBody } from "reactstrap";
import { DefaultColumnFilter } from "./filters";
import {
  ProductsGlobalFilter,
  CustomersGlobalFilter,
  OrderGlobalFilter,
  ContactsGlobalFilter,
  CompaniesGlobalFilter,
  LeadsGlobalFilter,
  CryptoOrdersGlobalFilter,
  InvoiceListGlobalSearch,
  TicketsListGlobalFilter,
  NFTRankingGlobalFilter,
  TaskListGlobalFilter,
} from "../../Components/Common/GlobalSearchFilter";
import { Link } from "react-router-dom";

// Define a default UI for filtering
function GlobalFilter({
  globalFilter,
  setGlobalFilter,
  isCustomerFilter,
  isOrderFilter,
  isContactsFilter,
  isCompaniesFilter,
  isCryptoOrdersFilter,
  isInvoiceListFilter,
  isTicketsListFilter,
  isNFTRankingFilter,
  isTaskListFilter,
  isProductsFilter,
  isLeadsFilter,
  SearchPlaceholder
}) {
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <React.Fragment>
      <Input
        type="search"
        className="form-control search"
        placeholder={SearchPlaceholder || "Search..."}
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
    </React.Fragment>
  );
}

const TableContainer = ({
  columns,
  data,
  isGlobalSearch,
  isGlobalFilter,
  isProductsFilter,
  isCustomerFilter,
  isOrderFilter,
  isContactsFilter,
  isCompaniesFilter,
  isLeadsFilter,
  isCryptoOrdersFilter,
  isInvoiceListFilter,
  isTicketsListFilter,
  isNFTRankingFilter,
  isTaskListFilter,
  isAddOptions,
  isAddUserList,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  isAddCustList,
  customPageSize,
  tableClass,
  theadClass,
  trClass,
  thClass,
  divClass,
  SearchPlaceholder,
  totalRecords,
  onChangePage,
  onChangeRowsPerPage,
  serverPagination,
  totalPages,
  currentPage
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0, pageSize: customPageSize, selectedRowIds: 0, sortBy: [
          {
            desc: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const handlePageChange = (newPageIndex) => {
    if (serverPagination && onChangePage) {
      onChangePage(newPageIndex);
    } else {
      gotoPage(newPageIndex);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    if (serverPagination && onChangeRowsPerPage) {
      onChangeRowsPerPage(newPageSize);
    } else {
      setPageSize(newPageSize);
    }
  };

  const onChangeInSelect = (event) => {
    handlePageSizeChange(Number(event.target.value));
  };

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (
      <span className="ms-2">
        {column.isSortedDesc ? (
          <i className="ri-sort-desc" />
        ) : (
          <i className="ri-sort-asc" />
        )}
      </span>
    ) : (
      <span className="ms-2">
        <i className="ri-sort-line text-muted" />
      </span>
    );
  };

  return (
    <Fragment>
      <Row className="mb-3">
        {isGlobalSearch && (
          <Col md={1}>
            <select
              className="form-select"
              value={pageSize}
              onChange={onChangeInSelect}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Col>
        )}
        {isGlobalFilter && (
          <Col sm={4}>
            <div className="search-box me-2 mb-2 d-inline-block">
              <div className="position-relative">
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  isProductsFilter={isProductsFilter}
                  isCustomerFilter={isCustomerFilter}
                  isOrderFilter={isOrderFilter}
                  isContactsFilter={isContactsFilter}
                  isCompaniesFilter={isCompaniesFilter}
                  isLeadsFilter={isLeadsFilter}
                  isCryptoOrdersFilter={isCryptoOrdersFilter}
                  isInvoiceListFilter={isInvoiceListFilter}
                  isTicketsListFilter={isTicketsListFilter}
                  isNFTRankingFilter={isNFTRankingFilter}
                  isTaskListFilter={isTaskListFilter}
                  SearchPlaceholder={SearchPlaceholder}
                />
                <i className="ri-search-line search-icon" />
              </div>
            </div>
          </Col>
        )}
        {isAddOptions && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="rounded-pill  mb-2 me-2"
                onClick={handleOrderClicks}
              >
                <i className="mdi mdi-plus me-1" />
                Add New Order
              </Button>
            </div>
          </Col>
        )}
        {isAddUserList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="primary"
                className="btn mb-2 me-2"
                onClick={handleUserClick}
              >
                <i className="mdi mdi-plus-circle-outline me-1" />
                Create New User
              </Button>
            </div>
          </Col>
        )}
        {isAddCustList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="rounded-pill mb-2 me-2"
                onClick={handleCustomerClick}
              >
                <i className="mdi mdi-plus me-1" />
                New Customers
              </Button>
            </div>
          </Col>
        )}
      </Row>


      <div className={divClass} style={{ overflowY: 'hidden' }}>
        <Table hover {...getTableProps()} className={`${tableClass} custom-header-css table align-middle table-nowrap`} 
          style={{ 
            width: 'auto',
            minWidth: '100%'
          }}>
          <thead className={`${theadClass} text-muted table-light`}>
            {headerGroups.map((headerGroup) => (
              <tr className={`${trClass} align-middle`} key={headerGroup.id} {...headerGroup.getHeaderGroupProps({
                key: undefined
              })}>
                {headerGroup.headers.map((column, index) => (
                  <th key={column.id} 
                      className={`${thClass} py-1`} 
                      {...column.getSortByToggleProps({
                        key: undefined
                      })}
                      style={{ 
                        whiteSpace: 'nowrap', 
                        paddingLeft: index === 0 ? '1rem' : '0.5rem',
                        paddingRight: '0.5rem',
                        backgroundColor: 'var(--vz-card-bg-custom)',
                        cursor: 'pointer',
                        width: column.id === 'action' ? '100px' : 'auto'
                      }}>
                    <div className="d-flex align-items-center">
                      <span className="text-muted">{column.render("Header")}</span>
                      <span className="ms-2">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <i className="mdi mdi-sort-variant-remove fs-16 text-muted"></i>
                          ) : (
                            <i className="mdi mdi-sort-ascending fs-16 text-muted"></i>
                          )
                        ) : (
                          <i className="mdi mdi-sort-variant fs-16 text-muted"></i>
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className="form-check-all">
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <Fragment key={`row-${rowIndex}-${row.id}`}>
                  <tr className="table-centered align-middle table-nowrap mb-0" {...row.getRowProps({
                    key: undefined
                  })}>
                    {row.cells.map((cell, index) => (
                      <td key={`${row.id}-${cell.id}`} 
                          {...cell.getCellProps({
                            key: undefined
                          })}
                          style={{
                            paddingLeft: index === 0 ? '1rem' : '0.5rem',
                            paddingRight: '0.5rem',
                            backgroundColor: 'var(--vz-card-bg-custom)',
                            width: cell.column.id === 'action' ? '100px' : 'auto'
                          }}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      </div>
      
      <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
        <div className="col-sm">
            <div className="text-muted">Showing<span className="fw-semibold ms-1">{page.length}</span> of <span className="fw-semibold">{totalRecords || data.length}</span> Results
            </div>
        </div>
        <div className="col-sm-auto">
            <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
                <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
                    <Link to="#" className="page-link" onClick={() => handlePageChange(currentPage - 2)}>Previous</Link>
                </li>
                {serverPagination ? (
                  // Server-side pagination page options
                  Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className="page-item">
                      <Link 
                        to="#" 
                        className={currentPage === i + 1 ? "page-link active" : "page-link"} 
                        onClick={() => handlePageChange(i)}
                      >
                        {i + 1}
                      </Link>
                    </li>
                  ))
                ) : (
                  // Client-side pagination page options
                  pageOptions.map((item, key) => (
                    <li key={key} className="page-item">
                      <Link 
                        to="#" 
                        className={pageIndex === item ? "page-link active" : "page-link"} 
                        onClick={() => handlePageChange(item)}
                      >
                        {item + 1}
                      </Link>
                    </li>
                  ))
                )}
                <li className={currentPage >= totalPages ? "page-item disabled" : "page-item"}>
                    <Link to="#" className="page-link" onClick={() => handlePageChange(currentPage)}>Next</Link>
                </li>
            </ul>
        </div>
      </Row>
    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;