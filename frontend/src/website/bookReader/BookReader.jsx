import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { BASE_URL } from "../../http";
import { Header } from "../../components";

const BookReader = () => {
  const { fileName } = useParams();
  const fileUrl = `${BASE_URL}/uploads/${fileName}`;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

  const transform = (slot) => ({
    ...slot,
    Download: () => <></>,
    SwitchTheme: () => <></>,
    ShowSearchPopover: () => <></>,
    Print: () => <></>,
    Open: () => <></>,
  });

  const pageLayout = {
    buildPageStyles: () => ({
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
    }),
    transformSize: ({ size }) => ({
      height: size.height + 30,
      width: size.width + 30,
    }),
  };

  const handlePageChange = (e) => {
    localStorage.setItem(`current-page-${fileName}`, `${e.currentPage}`);
  };

  const initialPage = localStorage.getItem(`current-page-${fileName}`)
    ? parseInt(localStorage.getItem(`current-page-${fileName}`), 10)
    : 0;

  useEffect(() => {
    const checkFile = async () => {
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error("File not found");
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load the PDF file.");
        setLoading(false);
      }
    };
    checkFile();
  }, [fileUrl]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>Loading book...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "calc(100vh - 89px)" }}>
      <Header />
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <div
          className="rpv-core__viewer"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#4cceac",
              color: "white",
              display: "flex",
              padding: "0.25rem",
            }}
          >
            <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
          </div>
          <div
            style={{
              flex: 1,
              overflow: "hidden",
            }}
          >
            <Viewer
              fileUrl={fileUrl}
              plugins={[toolbarPluginInstance]}
              initialPage={initialPage}
              pageLayout={pageLayout}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </Worker>
    </div>
  );
};

export default BookReader;
