package de.neighbourly.backend.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class LocationMaskingUtil {

    private LocationMaskingUtil() {
    }

    public static MaskedCoordinates maskedCoordinates(Double lat, Double lng, Integer radiusM) {
        if (lat == null || lng == null) {
            throw new IllegalArgumentException("lat and lng are required");
        }

        if (radiusM == null || radiusM <= 0) {
            throw new IllegalArgumentException("radius_m must be greater than 0");
        }

        int decimals = decimalsForRadius(radiusM);

        return new MaskedCoordinates(
                round(lat, decimals),
                round(lng, decimals)
        );
    }

    private static int decimalsForRadius(Integer radiusM) {
        if (radiusM <= 500) {
            return 3;
        }

        if (radiusM <= 5_000) {
            return 2;
        }

        if (radiusM <= 50_000) {
            return 1;
        }

        return 0;
    }

    private static Double round(Double value, int decimals) {
        return BigDecimal.valueOf(value)
                .setScale(decimals, RoundingMode.HALF_UP)
                .doubleValue();
    }

    public record MaskedCoordinates(Double lat, Double lng) {
    }
}