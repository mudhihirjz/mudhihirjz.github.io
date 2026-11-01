package com.kilivolabs.app;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.view.View;

@SuppressLint("ViewConstructor")
final class ProductIconView extends View {
    static final int BUS = 0;
    static final int SCHOOL = 1;
    static final int SHOP = 2;
    static final int HEALTH = 3;

    private final int icon;
    private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

    ProductIconView(Context context, int icon) {
        super(context);
        this.icon = icon;
        GradientDrawable background = new GradientDrawable();
        background.setColor(Color.rgb(12, 187, 181));
        background.setCornerRadius(dp(context, 13));
        setBackground(background);
        setContentDescription(new String[]{
                "Bus booking", "Education", "Retail shop", "Clinic health"
        }[icon]);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        float scale = Math.min(getWidth(), getHeight()) / 48f;
        canvas.save();
        canvas.translate((getWidth() - 48 * scale) / 2f, (getHeight() - 48 * scale) / 2f);
        canvas.scale(scale, scale);
        paint.setColor(Color.WHITE);
        paint.setStrokeWidth(3.2f);
        paint.setStrokeCap(Paint.Cap.ROUND);
        paint.setStrokeJoin(Paint.Join.ROUND);
        paint.setStyle(Paint.Style.STROKE);

        switch (icon) {
            case BUS:
                drawBus(canvas);
                break;
            case SCHOOL:
                drawSchool(canvas);
                break;
            case SHOP:
                drawShop(canvas);
                break;
            case HEALTH:
                drawHeart(canvas);
                break;
            default:
                break;
        }
        canvas.restore();
    }

    private void drawBus(Canvas canvas) {
        canvas.drawRoundRect(new RectF(11, 7, 37, 34), 5, 5, paint);
        canvas.drawRect(15, 13, 33, 23, paint);
        canvas.drawLine(13, 29, 35, 29, paint);
        canvas.drawLine(16, 35, 16, 39, paint);
        canvas.drawLine(32, 35, 32, 39, paint);
        canvas.drawCircle(15, 28, 1.2f, paint);
        canvas.drawCircle(33, 28, 1.2f, paint);
    }

    private void drawSchool(Canvas canvas) {
        Path cap = new Path();
        cap.moveTo(4, 18);
        cap.lineTo(24, 8);
        cap.lineTo(44, 18);
        cap.lineTo(24, 28);
        cap.close();
        paint.setStyle(Paint.Style.FILL);
        canvas.drawPath(cap, paint);
        paint.setStyle(Paint.Style.STROKE);
        canvas.drawLine(13, 23, 13, 31, paint);
        canvas.drawLine(13, 31, 24, 36, paint);
        canvas.drawLine(24, 36, 36, 31, paint);
        canvas.drawLine(36, 31, 36, 23, paint);
        canvas.drawLine(42, 19, 42, 31, paint);
        canvas.drawCircle(42, 35, 1.8f, paint);
    }

    private void drawShop(Canvas canvas) {
        canvas.drawRect(10, 21, 38, 40, paint);
        Path awning = new Path();
        awning.moveTo(7, 19);
        awning.lineTo(11, 9);
        awning.lineTo(37, 9);
        awning.lineTo(41, 19);
        awning.cubicTo(41, 25, 34, 25, 34, 19);
        awning.cubicTo(34, 25, 27, 25, 27, 19);
        awning.cubicTo(27, 25, 20, 25, 20, 19);
        awning.cubicTo(20, 25, 13, 25, 13, 19);
        awning.cubicTo(13, 25, 6, 25, 7, 19);
        paint.setStyle(Paint.Style.FILL);
        canvas.drawPath(awning, paint);
        paint.setStyle(Paint.Style.STROKE);
        canvas.drawRect(18, 29, 27, 40, paint);
    }

    private void drawHeart(Canvas canvas) {
        Path heart = new Path();
        heart.moveTo(24, 40);
        heart.cubicTo(20, 37, 7, 29, 7, 18);
        heart.cubicTo(7, 8, 20, 7, 24, 16);
        heart.cubicTo(29, 7, 41, 8, 41, 18);
        heart.cubicTo(41, 29, 28, 37, 24, 40);
        canvas.drawPath(heart, paint);
        Path check = new Path();
        check.moveTo(17, 24);
        check.lineTo(22, 29);
        check.lineTo(32, 18);
        canvas.drawPath(check, paint);
    }

    private static float dp(Context context, float value) {
        return value * context.getResources().getDisplayMetrics().density;
    }
}
