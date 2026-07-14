package com.example.koinonia.presentation.ui.component

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CloudDone
import androidx.compose.material.icons.filled.CloudOff
import androidx.compose.material.icons.filled.CloudQueue
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.koinonia.presentation.viewmodel.SyncStatus

@Composable
fun SyncStatusIndicator(
    syncStatus: SyncStatus,
    pendingCount: Int,
    isConnected: Boolean,
    onSyncClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val transition = rememberInfiniteTransition(label = "SyncRotate")
    val rotation by transition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "Rotation"
    )

    val bgColor: Color
    val contentColor: Color
    val text: String
    val icon: @Composable () -> Unit

    when {
        !isConnected -> {
            bgColor = Color(0xFFFEF3C7) // Amber light
            contentColor = Color(0xFFD97706) // Amber dark
            text = "Offline${if (pendingCount > 0) " ($pendingCount pendente(s))" else ""}"
            icon = { Icon(Icons.Default.CloudOff, contentDescription = "Offline", tint = contentColor) }
        }
        syncStatus is SyncStatus.Syncing -> {
            bgColor = Color(0xFFEEF2F6) // Gray/Blue light
            contentColor = Color(0xFF3B82F6) // Blue
            text = "Sincronizando..."
            icon = {
                Icon(
                    Icons.Default.Sync,
                    contentDescription = "Sincronizando",
                    tint = contentColor,
                    modifier = Modifier.rotate(rotation)
                )
            }
        }
        pendingCount > 0 -> {
            bgColor = Color(0xFFFFE4E6) // Rose light
            contentColor = Color(0xFFE11D48) // Rose dark
            text = "$pendingCount não sincronizados"
            icon = {
                Icon(
                    Icons.Default.Sync,
                    contentDescription = "Pendências",
                    tint = contentColor
                )
            }
        }
        syncStatus is SyncStatus.Success -> {
            bgColor = Color(0xFFDCFCE7) // Green light
            contentColor = Color(0xFF16A34A) // Green dark
            text = "Sincronizado"
            icon = { Icon(Icons.Default.CloudDone, contentDescription = "Sincronizado", tint = contentColor) }
        }
        else -> {
            bgColor = Color(0xFFDCFCE7) // Green light
            contentColor = Color(0xFF16A34A) // Green dark
            text = "Sincronizado"
            icon = { Icon(Icons.Default.CloudDone, contentDescription = "Sincronizado", tint = contentColor) }
        }
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .background(bgColor)
            .clickable(enabled = isConnected && syncStatus !is SyncStatus.Syncing) {
                onSyncClick()
            }
            .padding(horizontal = 12.dp, java.lang.Math.max(6, 6).dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            icon()
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = text,
                color = contentColor,
                fontSize = 11.sp,
                style = MaterialTheme.typography.labelMedium
            )
        }
    }
}
