import { useState, useEffect } from "react";
import "./App.css";
import {
  Flex,
  Text,
  Button,
  Switch,
  Select,
  TextField,
  Slider,
} from "@radix-ui/themes";
import { Theme } from "@radix-ui/themes";
import { useDropzone } from "react-dropzone";
import { Rnd } from "react-rnd";
import { UploadIcon } from "@radix-ui/react-icons";

function App() {
  const [showDevicePositionGuides, setShowDevicePositionGuides] =
    useState(true);

  const [showTextWrapGuide, setShowTexWrapGuide] = useState(false);
  const [headerRightOffset, setHeaderRightOffset] = useState(800);

  const [deviceWidth, setDeviceWidth] = useState(300);

  const [deviceType, setDeviceType] = useState("laptop");
  const [editingCanvas, setEditingCanvas] = useState("desktop");

  const [deviceNickname, setDeviceNickname] = useState("Lorem ipsum Nickname");
  const [deviceModel, setDeviceModel] = useState("Dolrem et al 7955e");

  const [isImageScrollScaled, setIsImageScrollScaled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const triggerPoint = 300; // The scroll position where you want to trigger the resize

      if (scrollPosition > triggerPoint) {
        setIsImageScrollScaled(true); // Reduce size
      } else {
        setIsImageScrollScaled(false); // Restore original size
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSliderChange = (newDeviceWidthValue) => {
    setDeviceWidth(newDeviceWidthValue[0]); // Update state with the slider value
  };

  const handleIDeviceWidthnputChange = (e) => {
    const newDeviceWidthValue = Number(e.target.value);
    if (
      !isNaN(newDeviceWidthValue) &&
      newDeviceWidthValue >= 0 &&
      newDeviceWidthValue <= 100
    ) {
      setDeviceWidth(newDeviceWidthValue); // Update state with the input value
    }
  };

  const handleDeviceNicknameInputChange = (e) => {
    const newDeviceNicknameValue = e.target.value;
    setDeviceNickname(newDeviceNicknameValue); // Update state with the input value
  };

  const handleDeviceModelInputChange = (e) => {
    const newDevicModeleValue = e.target.value;
    setDeviceModel(newDevicModeleValue); // Update state with the input value
  };

  const [imageOffset, setImageOffset] = useState({
    rightOffset: 100,
    topOffset: 0,
  });

  // drag and drop
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <img
      style={{
        width: "100%",
        zIndex: "100",
        transition: "transform 0.3s ease", // Smooth transition
        // transform: isImageScrollScaled ? "scale(0.9)" : "scale(1)",
        opacity: isImageScrollScaled ? "0.5" : "1",
      }}
      key={file.name}
      src={file.preview}
      // Revoke data uri after image is loaded
      onLoad={() => {
        URL.revokeObjectURL(file.preview);
      }}
      alt="Draggable"
    />
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  const createAndDownloadJson = () => {
    const jsonData = {
      sku: "placeholder",
      name: deviceModel,
      prettyName: deviceNickname,
      LogoType: "tbd",
      deviceImage: {
        "Left Facing": {
          large: {
            uri: "tbd",
            width: deviceWidth,
            height: "auto",
            top: imageOffset.topOffset,
            right: imageOffset.rightOffset,
            wrap: headerRightOffset,
          },
          small: {
            uri: "tbd",
            width: "tbd",
            height: "tbd",
            top: "tbd",
            right: "tbd",
            wrap: "tbd",
          },
        },
      },
    };

    const fileName = "data.txt";
    const fileContent = JSON.stringify(jsonData, null, 2); // Pretty-printed JSON
    const blob = new Blob([fileContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = fileName;
    link.href = window.URL.createObjectURL(blob);
    link.click();
    window.URL.revokeObjectURL(link.href);
  };

  return (
    <>
      {/* <div
        className="test"
        style={{
          background: "red",
          width: "200px",
          height: "200px",
          position: "absolute",
        }}
      /> */}
      {thumbs?.length > 0 && (
        <Rnd
          enableResizing={false}
          default={{
            x: 100,
            y: 0,
          }}
          onDragStop={(e, d) => {}}
          onDrag={(e, d) => {
            const elementWidth = deviceWidth; // The width of the element (default value)
            const parent = document.getElementById("root"); // Reference to parent container
            const parentWidth = parent.offsetWidth; // Parent container's width
            const rightPosition = parentWidth - (d.x + elementWidth);
            setImageOffset({
              rightOffset: rightPosition,
              topOffset: d.y,
            });
          }}
        >
          <div style={{ border: "1px solid red", width: deviceWidth + "px" }}>
            {thumbs}
          </div>
        </Rnd>
      )}
      <Rnd
        enableResizing={false}
        onDrag={(e, d) => {
          const elementWidth = 10; // The width of the element (default value)
          const parent = document.getElementById("root"); // Reference to parent container
          const parentWidth = parent.offsetWidth; // Parent container's width
          const rightPosition = parentWidth - (d.x + elementWidth);
          setHeaderRightOffset(rightPosition);
        }}
        dragAxis="x"
        default={{
          x: 800,
          y: 0,
          width: 10,
          height: "100%",
        }}
        style={{ position: "fixed" }}
      >
        <div
          id="text-wrap-line"
          style={{
            opacity: showTextWrapGuide ? "100" : "0",
          }}
        ></div>
      </Rnd>
      <div>
        <div
          id="desktop-printer-overlay"
          style={{
            opacity:
              showDevicePositionGuides && deviceType === "printer"
                ? "100"
                : "0",
          }}
        ></div>
        <div
          id="desktop-laptop-overlay"
          style={{
            opacity:
              showDevicePositionGuides && deviceType === "laptop" ? "100" : "0",
          }}
        ></div>

        <div className="example-header-bar-area">
          <div className="back-button">
            <img width="133px" src="img/devices_back_button.png" alt="" />
          </div>
          <div className="navigation-buttons">
            <img width="106px" src="img/navigation.png" alt="" />
          </div>
          <div className="trailing-buttons">
            <img width="144px" src="img/trailing.png" alt="" />
          </div>
        </div>

        <div
          id="example-header-content-area"
          style={{ right: headerRightOffset + "px" }}
        >
          <div id="device-nickname">{deviceNickname}</div>
          <div className="device-model">{deviceModel}</div>
        </div>
        <div className="example-body-area">
          <img width="739" src="img/printer_cards.png" alt="" />
        </div>

        <Theme appearance="dark">
          <div className="toolbar">
            <Flex direction="row" gap="9">
              <Flex direction="column" gap="5" width="100%">
                <Flex direction="column" gap="1">
                  <Text size="1">Device nickname</Text>
                  <TextField.Root
                    width="100px"
                    value={deviceNickname}
                    onChange={handleDeviceNicknameInputChange}
                    placeholder="Device nickname"
                    min="0"
                    max="3000"
                  />
                </Flex>
                <Flex direction="column" gap="1">
                  <Text size="1">Device model</Text>
                  <TextField.Root
                    width="100px"
                    value={deviceModel}
                    onChange={handleDeviceModelInputChange}
                    placeholder="Device model"
                    min="0"
                    max="3000"
                  />
                </Flex>
                <Flex direction="column" gap="1">
                  <Text size="1">Device type</Text>
                  <Select.Root onValueChange={setDeviceType} value={deviceType}>
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Group>
                        <Select.Item value="generic">Generic</Select.Item>
                        <Select.Item value="laptop">Laptop</Select.Item>
                        <Select.Item value="printer">Printer</Select.Item>
                        <Select.Item value="mouse">Mouse</Select.Item>
                        <Select.Item value="keyboard">Keyboard</Select.Item>
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </Flex>
              </Flex>
              <Flex direction="column" gap="5" width="100%">
                <Flex direction="column" gap="1">
                  <Text size="1">Editing canvas</Text>
                  <Select.Root
                    onValueChange={setEditingCanvas}
                    value={editingCanvas}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Group>
                        <Select.Item value="desktop">Desktop</Select.Item>
                        <Select.Item value="mobile" disabled>
                          Mobile
                        </Select.Item>
                        <Select.Item value="deviceList" disabled>
                          Device List
                        </Select.Item>
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </Flex>
                <Flex direction="column" gap="1">
                  <Text size="1">Device position guides</Text>
                  <Switch
                    onCheckedChange={setShowDevicePositionGuides}
                    checked={showDevicePositionGuides}
                  />
                </Flex>
                <Flex direction="column" gap="1">
                  <Text size="1">Text wrap guide</Text>
                  <Switch
                    onCheckedChange={setShowTexWrapGuide}
                    checked={showTextWrapGuide}
                  />
                </Flex>
              </Flex>
              <Flex direction="column" width="100%" gap="5">
                <Flex direction="column" gap="1">
                  <Text size="1">Device Width</Text>
                  <TextField.Root
                    width="100px"
                    value={deviceWidth}
                    onChange={handleIDeviceWidthnputChange}
                    placeholder="Device width"
                    min="0"
                    max="3000"
                  />
                  <Slider
                    value={[deviceWidth]}
                    onValueChange={handleSliderChange}
                    max={3000}
                    step={1}
                  />
                </Flex>
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <UploadIcon />
                  <span>Upload device image here</span>
                </div>
              </Flex>
              <Flex direction="column" gap="5" width="100%">
                <Button
                  style={{ width: "200px" }}
                  onClick={createAndDownloadJson}
                >
                  Export JSON
                </Button>
              </Flex>
            </Flex>
          </div>
        </Theme>
      </div>
    </>
  );
}

export default App;
