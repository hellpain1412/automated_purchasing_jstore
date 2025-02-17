import * as React from "react";
import Stack from "@mui/joy/Stack";
import Input from "@mui/joy/Input";
import LinearProgress from "@mui/joy/LinearProgress";
import Typography from "@mui/joy/Typography";
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Tab,
  tabClasses,
  TabList,
  TabPanel,
  Tabs,
} from "@mui/joy";
import {
  FileOpen,
  GroupAdd,
  Key,
  Person,
  PlayArrow,
  ReportProblem,
  SaveAlt,
  TravelExplore,
  Visibility,
  VisibilityOff,
} from "../icon";
import { CommonEventName, PurchasingEventName } from "@/common/constant";
import TableStickyHeader from "../component/Table";
import { Product } from "@/main/use-case";
import { Stop } from "../icon/Stop";

interface IProcessRequirement {
  password: string;
  email: string;
  xlsxPath: string;
  resultPath?: string;
  chromePath: string;
  chromeProfilePath?: string;
  isRunInBackground: boolean;
}

export function Dashboard() {
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [xlsxPath, setXlsxPath] = React.useState("");
  const [resultPath, setResultPath] = React.useState("");
  const [chromePath, setChromePath] = React.useState("");
  const [chromeProfilePath, setChromeProfilePath] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [count, setCount] = React.useState(1);
  const [products, setProducts] = React.useState<Product[]>([]);

  const [isRunInBackground, setIsRunInBackground] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsError(false);
  }, [password, email, xlsxPath, resultPath, chromePath, chromeProfilePath]);

  React.useEffect(() => {
    const email = window.localStorage.getItem("email");
    email && setEmail(JSON.parse(email));
    const password = window.localStorage.getItem("password");
    password && setPassword(JSON.parse(password));
    const xlsxPath = window.localStorage.getItem("xlsxPath");
    xlsxPath && setXlsxPath(JSON.parse(xlsxPath));
    const resultPath = window.localStorage.getItem("resultPath");
    resultPath && setResultPath(JSON.parse(resultPath));
    const chromePath = window.localStorage.getItem("chromePath");
    chromePath && setChromePath(JSON.parse(chromePath));
    const chromeProfilePath = window.localStorage.getItem("chromeProfilePath");
    chromeProfilePath && setChromeProfilePath(JSON.parse(chromeProfilePath));
    const isRunInBackground = window.localStorage.getItem("isRunInBackground");
    isRunInBackground && setIsRunInBackground(JSON.parse(isRunInBackground));
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSelectFile = async () => {
    const path = await window[CommonEventName.EVENT_NAME].getFilePath();
    path && setXlsxPath(path);
  };

  const handleChromePath = async () => {
    const path = await window[CommonEventName.EVENT_NAME].getFilePath();
    path && setChromePath(path);
  };

  const handleChromeProfilePath = async () => {
    const path = await window[CommonEventName.EVENT_NAME].getDirectoryPath();
    path && setChromeProfilePath(path);
  };

  const handleOutputFile = async () => {
    const path = await window[CommonEventName.EVENT_NAME].getDirectoryPath();
    path && setResultPath(path);
  };

  const handleRunInBackground = () => {
    setIsRunInBackground(!isRunInBackground);
  };

  const startProcess = () => {
    if (isLoading) {
      window[PurchasingEventName.EVENT_NAME].stopProcess();
      return;
    }
    if (!password || !email || !xlsxPath || !chromePath || !chromeProfilePath) {
      setIsError(true);
      return;
    }
    setIsSubmitted(true);
    setIsLoading(true);
    setIndex(1);
    setCount(1);
    const requirement: IProcessRequirement = {
      password,
      email,
      xlsxPath,
      resultPath,
      chromePath,
      chromeProfilePath,
      isRunInBackground,
    };

    Object.keys(requirement).forEach((key: keyof typeof requirement) => {
      window.localStorage.setItem(key, JSON.stringify(requirement[key]));
    });

    window[PurchasingEventName.EVENT_NAME].startProcess(requirement);
    window[PurchasingEventName.EVENT_NAME].xlsxData((args: any) => {
      setProducts(args);
    });

    window[PurchasingEventName.EVENT_NAME].getProductList((args: any) => {
      console.log(args);
      setCount((prev) => prev + 1);
      setProducts((prev) =>
        prev.map((product) => {
          const exist = args.find(
            (item: Product) => item.productId === product.productId
          );
          return {
            ...product,
            ...exist,
          };
        })
      );
    });

    window[PurchasingEventName.EVENT_NAME].status((args: any) => {
      setProducts((prev) =>
        prev.map((product) => {
          return {
            ...product,
            ...(args.productId === product.productId && args),
          };
        })
      );
    });

    window[PurchasingEventName.EVENT_NAME].endProcess((args: any) => {
      setIsLoading(false);
      setProducts((prev) => {
        window[CommonEventName.EVENT_NAME].exportXlsx(prev, resultPath);
        return prev;
      });
    });
  };

  const minLength = 12;
  return (
    <Stack
      spacing={2}
      sx={{
        "--hue": Math.min(password.length * 10, 120),
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
      }}
    >
      <Stack
        sx={{
          height: "133px",
        }}
      >
        <Typography
          level="h1"
          fontFamily={"Inter"}
          fontSize={50}
          sx={{
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          AUTO PURCHASING JSTORE
        </Typography>

        {isError && (
          <Alert
            sx={{ alignItems: "flex-start" }}
            startDecorator={<ReportProblem />}
            variant="soft"
            color="danger"
          >
            <div>
              <div>Lỗi</div>
              <Typography level="body-sm" color="danger">
                Vui lòng nhập đầy đủ thông tin!
              </Typography>
            </div>
          </Alert>
        )}
      </Stack>
      {/* <TabsSegmentedControls /> */}
      <Box sx={{ flexGrow: 1, m: -2, overflowX: "hidden" }}>
        <Tabs
          aria-label="Pipeline"
          value={index}
          onChange={(event, value) => setIndex(value as number)}
          sx={{ bgcolor: "transparent" }}
        >
          <TabList
            sx={{
              pt: 1,
              justifyContent: "center",
              [`&& .${tabClasses.root}`]: {
                flex: "initial",
                bgcolor: "transparent",
                "&:hover": {
                  bgcolor: "transparent",
                },
                [`&.${tabClasses.selected}`]: {
                  color: "primary.plainColor",
                  "&::after": {
                    height: 2,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    bgcolor: "primary.500",
                  },
                },
              },
            }}
          >
            <Tab indicatorInset>Cài đặt</Tab>
            <Tab indicatorInset>Thông tin</Tab>
          </TabList>
          <Box
            sx={(theme) => ({
              "--bg": theme.vars.palette.background.surface,
              background: "var(--bg)",
              boxShadow: "0 0 0 100vmax var(--bg)",
              clipPath: "inset(0 -100vmax)",
            })}
          >
            <TabPanel value={0}>
              <Stack spacing={2}>
                <React.Fragment>
                  <Card color="warning">
                    <FormControl>
                      <FormLabel
                        sx={(theme) => ({
                          "--FormLabel-color":
                            theme.vars.palette.primary.plainColor,
                        })}
                      >
                        Tên đăng nhập:
                      </FormLabel>
                      <Input
                        sx={{ "--Input-decoratorChildHeight": "40px" }}
                        type="text"
                        placeholder="Nhập tên đăng nhập tại đây…"
                        startDecorator={<Person />}
                        disabled={isLoading}
                        value={email}
                        error={isSubmitted && email === ""}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        sx={(theme) => ({
                          "--FormLabel-color":
                            theme.vars.palette.primary.plainColor,
                        })}
                      >
                        Mật khẩu:
                      </FormLabel>
                      <Input
                        sx={{ "--Input-decoratorChildHeight": "40px" }}
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu tại đây…"
                        disabled={isLoading}
                        startDecorator={<Key />}
                        endDecorator={
                          <IconButton
                            aria-label={
                              showPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        }
                        value={password}
                        error={isSubmitted && password === ""}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                      <LinearProgress
                        determinate
                        size="sm"
                        value={Math.min(
                          (password.length * 100) / minLength,
                          100
                        )}
                        sx={{
                          bgcolor: "background.level3",
                          color: "hsl(var(--hue) 80% 40%)",
                        }}
                      />
                      <Typography
                        level="body-xs"
                        sx={{
                          alignSelf: "flex-end",
                          color: "hsl(var(--hue) 80% 30%)",
                        }}
                      >
                        {password.length < 3 && "Very weak"}
                        {password.length >= 3 && password.length < 6 && "Weak"}
                        {password.length >= 6 &&
                          password.length < 10 &&
                          "Strong"}
                        {password.length >= 10 && "Very strong"}
                      </Typography>
                    </FormControl>
                  </Card>

                  <Divider />

                  <Card color="success">
                    <FormControl>
                      <FormLabel
                        sx={(theme) => ({
                          "--FormLabel-color":
                            theme.vars.palette.primary.plainColor,
                        })}
                      >
                        File Exel:
                      </FormLabel>
                      <Input
                        sx={{ "--Input-decoratorChildHeight": "40px" }}
                        placeholder="Đường dẫn đến file exel…"
                        type="email"
                        required
                        value={xlsxPath}
                        error={isSubmitted && xlsxPath === ""}
                        onChange={(event) => setXlsxPath(event.target.value)}
                        disabled={isLoading}
                        endDecorator={
                          <Button
                            variant="solid"
                            color="primary"
                            type="submit"
                            onClick={handleSelectFile}
                            sx={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                            }}
                          >
                            <FileOpen />
                          </Button>
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        sx={(theme) => ({
                          "--FormLabel-color":
                            theme.vars.palette.primary.plainColor,
                        })}
                      >
                        Lưu file kết quả:
                      </FormLabel>
                      <Input
                        sx={{ "--Input-decoratorChildHeight": "40px" }}
                        placeholder="Đường dẫn đến file kết quả…"
                        type="email"
                        required
                        value={resultPath}
                        onChange={(event) => setResultPath(event.target.value)}
                        disabled={isLoading}
                        endDecorator={
                          <Button
                            variant="solid"
                            color="primary"
                            type="submit"
                            onClick={handleOutputFile}
                            sx={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                            }}
                          >
                            <SaveAlt />
                          </Button>
                        }
                      />
                    </FormControl>
                  </Card>

                  <Card>
                    <FormControl>
                      <FormLabel
                        sx={(theme) => ({
                          "--FormLabel-color":
                            theme.vars.palette.primary.plainColor,
                        })}
                      >
                        Đường dẫn trình duyệt:
                      </FormLabel>
                      <Input
                        sx={{ "--Input-decoratorChildHeight": "40px" }}
                        placeholder="Đường dẫn đến file chrome.exe…"
                        type="email"
                        required
                        value={chromePath}
                        error={isSubmitted && chromePath === ""}
                        onChange={(event) => setChromePath(event.target.value)}
                        disabled={isLoading}
                        endDecorator={
                          <Button
                            variant="solid"
                            color="primary"
                            type="submit"
                            onClick={handleChromePath}
                            sx={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                            }}
                          >
                            <TravelExplore />
                          </Button>
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        sx={(theme) => ({
                          "--FormLabel-color":
                            theme.vars.palette.primary.plainColor,
                        })}
                      >
                        Đường dẫn profile:
                      </FormLabel>
                      <Input
                        sx={{ "--Input-decoratorChildHeight": "40px" }}
                        placeholder="Đường dẫn đến profile chrome…"
                        type="email"
                        required
                        value={chromeProfilePath}
                        error={isSubmitted && chromeProfilePath === ""}
                        onChange={(event) =>
                          setChromeProfilePath(event.target.value)
                        }
                        disabled={isLoading}
                        endDecorator={
                          <Button
                            variant="solid"
                            color="primary"
                            type="submit"
                            onClick={handleChromeProfilePath}
                            sx={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                            }}
                          >
                            <GroupAdd />
                          </Button>
                        }
                      />
                    </FormControl>

                    <Checkbox
                      color="primary"
                      size="md"
                      variant="soft"
                      label="Chạy nền"
                      checked={isRunInBackground}
                      onChange={handleRunInBackground}
                      disabled={isLoading}
                    />
                  </Card>
                </React.Fragment>
              </Stack>
            </TabPanel>
            <TabPanel value={1}>
              <TableStickyHeader products={products} count={count} />
            </TabPanel>
          </Box>
        </Tabs>
      </Box>

      <Divider />
      <Button
        startDecorator={isLoading ? <Stop /> : <PlayArrow />}
        sx={{ height: 60, fontSize: 15 }}
        onClick={startProcess}
        color={isLoading ? "danger" : "primary"}
      >
        {isLoading ? "Kết thúc" : "Bắt đầu"}
      </Button>
    </Stack>
  );
}
