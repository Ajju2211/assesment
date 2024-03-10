// EmailForm.js
import React, { useCallback, useEffect, useState } from 'react';
import { Box, TextInput, Button, FormField, Text, Meter } from 'grommet';
import { useImmer } from "use-immer";
import { phoneLoginAsync, phoneVerifyAsync } from '../features/user/userSlice';
import executeThunk from '../app/asynkThunkDispatchhandler';



const PhoneForm = () => {
  const [isSent, setIsSent] = useState(false)
  const [msg, setMsg] = useState("");
  const [phoneForm, setPhoneForm] = useImmer({
    phone: "",
    otp: "",
    timer: 0
  })
  const handleFieldChange = useCallback((fieldName) => ((event) => {
    setPhoneForm(draft => {
      draft[fieldName] = event.target.value
    })
  }), [setPhoneForm])

  useEffect(() => {
    if (!isSent) {
      return
    }
    const interval = setInterval(() => {
      if (phoneForm.timer > 0) {
        setPhoneForm(draft => { draft.timer -= 1 })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isSent, phoneForm.timer, setPhoneForm])

  const handleSubmit = useCallback((submitType) => (async (event) => {
    if (phoneForm.phone === "") {
      setMsg("Please enter phone number")
      return
    }

    if (submitType === "verifyOTP") {
      if (phoneForm.otp === "") {
        setMsg("Please enter otp")
        return
      }

      executeThunk(phoneVerifyAsync({ phoneNumber: phoneForm.phone, otp: phoneForm.otp }), () => {
        window.location.assign("/");
      }, (errMsg) => {
        setMsg(errMsg)
      })
      return
    }
    executeThunk(phoneLoginAsync(phoneForm.phone), () => {
      setIsSent(true)
      setPhoneForm(draft => {
        draft.timer = 30
      })
    }, (errMsg) => {
      setMsg(errMsg)
    })
  }), [phoneForm.otp, phoneForm.phone, setPhoneForm])

  return (
    <Box>
      <FormField name="phone">
        <TextInput
          placeholder="Phone"
          name="phone"
          value={phoneForm.phone}
          onChange={handleFieldChange("phone")}
          disabled={isSent}
        />
      </FormField>
      <FormField name="otp">
        <TextInput
          placeholder="One Time Password"
          type="password"
          maxLength="6"
          minLength={"6"}
          name="otp"
          value={phoneForm.otp}
          onChange={handleFieldChange("otp")}
          disabled={!isSent}
        />
      </FormField>
      {
        msg && msg !== "" && <Text color="red" size="small" textAlign="end">*{msg}</Text>
      }

      {
        isSent ? <Button type={"button"} label={"Verify"} primary onClick={handleSubmit("verifyOTP")} /> : (
          <Button type={"button"} label={"Send OTP"} primary onClick={handleSubmit("requestOTP")} />
        )}
      {
        isSent && <Box>
          {phoneForm.timer > 0 ? (
            <Box align="center" pad="small">
              <Box direction="row" align="center" gap="small" style={{ position: "relative" }}>
                <Meter
                  type="circle"
                  background="light-1"
                  values={[{ value: (30 - phoneForm.timer) * 100 / 30, color: 'brand' }]}
                  size="50px"
                  thickness="xsmall"
                />
                <Box align="center" style={{ position: "absolute", left: "-5px", right: 0 }}>
                  <Text size="large" weight="bold" textAlign="center">
                    {phoneForm.timer}
                  </Text>
                </Box>
              </Box>
            </Box>

          ) :
            <Button type={"submit"} label={"Resend OTP"} color="cyan" secondary onClick={handleSubmit("requestOTP")} margin={{ top: "xsmall" }} />
          }
        </Box>
      }
    </Box>
  );
};

export default PhoneForm;
