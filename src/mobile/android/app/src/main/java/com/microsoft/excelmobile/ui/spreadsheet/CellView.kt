package com.microsoft.excelmobile.ui.spreadsheet

import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.Rect
import android.util.AttributeSet
import android.view.View
import com.microsoft.excelmobile.models.Cell
import com.microsoft.excelmobile.models.CellStyle

/**
 * Custom View class for rendering and interacting with individual cells in the spreadsheet
 */
class CellView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    // Cell data
    var cell: Cell? = null
        set(value) {
            field = value
            applyStyle(value?.style)
            invalidate()
        }

    // Paints for rendering
    private val textPaint = Paint().apply {
        isAntiAlias = true
    }
    private val backgroundPaint = Paint()
    private val borderPaint = Paint().apply {
        style = Paint.Style.STROKE
    }

    // Rectangle for cell bounds
    private val cellRect = Rect()

    init {
        // Initialize default styles
        textPaint.textSize = 14f
        backgroundPaint.color = android.graphics.Color.WHITE
        borderPaint.color = android.graphics.Color.LTGRAY
    }

    /**
     * Applies the cell's style to the view
     */
    private fun applyStyle(style: CellStyle?) {
        style?.let { cellStyle ->
            // Update text paint properties
            textPaint.color = cellStyle.textColor
            textPaint.textSize = cellStyle.fontSize
            // TODO: Apply font, alignment, etc.

            // Update background paint
            backgroundPaint.color = cellStyle.backgroundColor

            // Update border paint
            borderPaint.color = cellStyle.borderColor
            // TODO: Apply border style (dashed, dotted, etc.)
        }
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        // Draw background
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), backgroundPaint)

        // Draw borders
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), borderPaint)

        cell?.let { cell ->
            // Draw cell value or formula result
            val text = cell.value?.toString() ?: ""
            val textX = paddingLeft.toFloat()
            val textY = (height / 2 + textPaint.textSize / 2).toFloat()
            canvas.drawText(text, textX, textY, textPaint)

            // TODO: Indicate if the cell has a formula (e.g., with a small triangle in the corner)
        }
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        val desiredWidth = 100 // Default width, can be adjusted based on content
        val desiredHeight = 50 // Default height, can be adjusted based on content

        val widthMode = MeasureSpec.getMode(widthMeasureSpec)
        val widthSize = MeasureSpec.getSize(widthMeasureSpec)
        val heightMode = MeasureSpec.getMode(heightMeasureSpec)
        val heightSize = MeasureSpec.getSize(heightMeasureSpec)

        val width = when (widthMode) {
            MeasureSpec.EXACTLY -> widthSize
            MeasureSpec.AT_MOST -> desiredWidth.coerceAtMost(widthSize)
            else -> desiredWidth
        }

        val height = when (heightMode) {
            MeasureSpec.EXACTLY -> heightSize
            MeasureSpec.AT_MOST -> desiredHeight.coerceAtMost(heightSize)
            else -> desiredHeight
        }

        setMeasuredDimension(width, height)
    }
}