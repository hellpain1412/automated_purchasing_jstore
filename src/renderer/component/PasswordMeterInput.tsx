import * as React from "react";
import Stack from "@mui/joy/Stack";
import Input from "@mui/joy/Input";
import LinearProgress from "@mui/joy/LinearProgress";
import Typography from "@mui/joy/Typography";
import { Button, FormControl, FormLabel, IconButton } from "@mui/joy";
import {
  FileOpen,
  Key,
  Person,
  SaveAlt,
  Visibility,
  VisibilityOff,
} from "../icon";

export function PasswordMeterInput() {
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [xlsxPath, setXlsxPath] = React.useState("");

  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading_1, setIsLoading_1] = React.useState(false);
  const [isLoading_2, setIsLoading_2] = React.useState(false);

  console.log(password, email);

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

  const handleSelectFile = (file: string) => {
    setIsLoading_1(true);
    setXlsxPath(file);
    setIsLoading_1(false);
  };
  const minLength = 12;
  return (
    <Stack
      spacing={2}
      sx={{ "--hue": Math.min(password.length * 10, 120), padding: 10 }}
    >
      <Typography level="h1" sx={{ justifyContent: "center", textAlign: "center" }}>
        AUTO PURCHASING JSTORE
      </Typography>
      <FormControl>
        <FormLabel
          sx={(theme) => ({
            "--FormLabel-color": theme.vars.palette.primary.plainColor,
          })}
        >
          Tên đăng nhập:
        </FormLabel>
        <Input
          sx={{ "--Input-decoratorChildHeight": "40px" }}
          type="text"
          placeholder="Nhập tên đăng nhập tại đây…"
          startDecorator={<Person />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel
          sx={(theme) => ({
            "--FormLabel-color": theme.vars.palette.primary.plainColor,
          })}
        >
          Mật khẩu:
        </FormLabel>
        <Input
          sx={{ "--Input-decoratorChildHeight": "40px" }}
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu tại đây…"
          startDecorator={<Key />}
          endDecorator={
            <IconButton
              aria-label={
                showPassword ? "hide the password" : "display the password"
              }
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          }
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <LinearProgress
          determinate
          size="sm"
          value={Math.min((password.length * 100) / minLength, 100)}
          sx={{
            bgcolor: "background.level3",
            color: "hsl(var(--hue) 80% 40%)",
          }}
        />
        <Typography
          level="body-xs"
          sx={{ alignSelf: "flex-end", color: "hsl(var(--hue) 80% 30%)" }}
        >
          {password.length < 3 && "Very weak"}
          {password.length >= 3 && password.length < 6 && "Weak"}
          {password.length >= 6 && password.length < 10 && "Strong"}
          {password.length >= 10 && "Very strong"}
        </Typography>
      </FormControl>

      <FormControl>
        <FormLabel
          sx={(theme) => ({
            "--FormLabel-color": theme.vars.palette.primary.plainColor,
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
          onChange={(event) => handleSelectFile(event.target.value)}
          endDecorator={
            <Button
              variant="solid"
              color="primary"
              loading={isLoading_1}
              type="submit"
              sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              <FileOpen />
            </Button>
          }
        />
      </FormControl>

      <FormControl>
        <FormLabel
          sx={(theme) => ({
            "--FormLabel-color": theme.vars.palette.primary.plainColor,
          })}
        >
          Lưu file kết quả:
        </FormLabel>
        <Input
          sx={{ "--Input-decoratorChildHeight": "40px" }}
          placeholder="Đường dẫn đến file kết quả…"
          type="email"
          required
          value={xlsxPath}
          onChange={(event) => handleSelectFile(event.target.value)}
          endDecorator={
            <Button
              variant="solid"
              color="primary"
              loading={isLoading_1}
              type="submit"
              sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              <SaveAlt />
            </Button>
          }
        />
      </FormControl>
    </Stack>
  );
}
