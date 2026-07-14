package com.example.koinonia

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun PlaceholderScreen(title: String, message: String) {
    Column(
        modifier = Modifier.fillMaxSize().padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(message, fontSize = 40.sp, modifier = Modifier.padding(bottom = 16.dp))
        Text(title, fontWeight = FontWeight.Bold, fontSize = 22.sp, color = Color(0xFF1F4788))
        Text("Módulo em desenvolvimento", fontSize = 14.sp, color = Color(0xFF64748B))
    }
}
