package com.nativemoduleproject.NativeViewModule;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.nativemoduleproject.R;

public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        Button loginButton = findViewById(R.id.login);
        loginButton.setOnClickListener( v-> {
            EditText username = findViewById(R.id.username);
            EditText password = findViewById(R.id.password);
            WritableMap params = Arguments.createMap();
            if(username.getText().toString().isEmpty() || password.getText().toString().isEmpty()){
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show();
                return;
            }
            params.putString("username", username.getText().toString());
            params.putString("password", password.getText().toString());
            NativeViewModule.sendEventToJS("onLogin", params);
            finish();
        });
    }
}