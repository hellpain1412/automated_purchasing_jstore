import * as React from "react";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { Product } from "@/main/use-case";
import { CommonEventName } from "@/common/constant";
import { Stack } from "@mui/joy";

export default function TableStickyHeader({
  products,
  count,
}: {
  products: Product[];
  count: number;
}) {
  const openLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    window[CommonEventName.EVENT_NAME].openLink(href);
  };
  return (
    <div>
      <Stack sx={{ textAlign: "center", mb: 2 }}>
        <Typography level="body-sm" sx={{ textAlign: "center", mb: 2 }}>
          Hiển thị thông tin quá trình.
        </Typography>
        <div>
          <strong>
            Lần quét số:{" "}
            <p
              style={{
                color: "green",
                display: "inline",
                marginLeft: 10,
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              {count}
            </p>
          </strong>
        </div>
      </Stack>

      <Sheet sx={{ height: "100%", maxHeight: "70vh", overflow: "auto" }}>
        <Table
          aria-label="table with sticky header"
          stickyHeader
          stickyFooter
          stripe="odd"
          hoverRow
        >
          <thead>
            <tr>
              <th style={{ width: "30px" }}>STT</th>
              <th style={{ minWidth: "110px" }}>Tiêu đề</th>
              <th style={{ width: "110px" }}>ID Sản phẩm</th>
              <th style={{ width: "40px" }}>Giá</th>
              <th style={{ width: "fit-content" }}>Link</th>
              <th style={{ width: "80px" }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    fontFamily: "Meiryo, sans-serif",
                  }}
                >
                  {product.name}
                </td>
                <td
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {product.productId}
                </td>
                <td>{product.price}</td>
                <td
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  <a href={product.url} onClick={(event) => openLink(event)}>
                    {product.url}
                  </a>
                </td>
                <td
                  style={{
                    color:
                      product.status === "success"
                        ? "green"
                        : product.status === "retry"
                        ? "red"
                        : "yellow",
                  }}
                >
                  {product.status}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <p>Total: {products.length} </p>
                  <p style={{ color: "green" }}>
                    {" "}
                    Hoàn thành:{" "}
                    {
                      products.filter((item) => item.status === "success")
                        .length
                    }{" "}
                  </p>
                </div>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Sheet>
    </div>
  );
}
