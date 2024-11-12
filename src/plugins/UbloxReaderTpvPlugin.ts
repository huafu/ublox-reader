import UbloxMessage from "../messages/UbloxMessage";
import { FixType, SentenceId } from "../constants";
import { UbloxGbsMessageData } from "../messages/UbloxGbsMessage";
import { UbloxGgaMessageData } from "../messages/UbloxGgaMessage";
import { UbloxGllMessageData } from "../messages/UbloxGllMessage";
import { UbloxGnsMessageData } from "../messages/UbloxGnsMessage";
import { UbloxGstMessageData } from "../messages/UbloxGstMessage";
import { UbloxRmcMessageData } from "../messages/UbloxRmcMessage";
import { UbloxUbx00MessageData } from "../messages/UbloxUbx00Message";
import { UbloxVtgMessageData } from "../messages/UbloxVtgMessage";
import UbloxReaderPlugin from "./UbloxReaderPlugin";
import UbloxPluginMessage from "../messages/UbloxPluginMessage";

export enum NmeaMode {
    Unknown = 0,
    noFix = 1,
    fix2d = 2,
    fix3d = 3,
}

export enum NmeaAntennaStatus {
    Short = 2,
    Open = 3,
}

export enum GpsFixStatus {
    unknown = 0,
    normal = 1,
    dgps = 2,
    rtkFixed = 3,
    rtkFloating = 4,
    dr = 5,
    gnssDr = 6,
    time = 7,
    simulated = 8,
    py = 9,
}

export interface TpvPluginMessage {
    class: "TPV";
    /** Name of the originating device. */
    device?: string;
    /** GPS mode: 0=unknown, 1=no fix, 2=2D, 3=3D. */
    mode: NmeaMode;
    /**
     * Use altHAE or altMSL.
     * @deprecated
     */
    alt?: number;
    /** Altitude, height above ellipsoid, in meters. Probably WGS84. */
    altHAE?: number;
    /** Altitude, height above MSL, in meters. The geoid used is rarely specified and is often inaccurate. See the comments below on geoidSep. altMSL is altHAE minus geoidSep. */
    altMSL?: number;
    /** Antenna status: 2=Short, 3=Open. */
    ant?: NmeaAntennaStatus;
    /** Climb (positive) or sink (negative) rate, meters per second. */
    climb?: number;
    /** Offset of local GNSS clock relative to UTC, in ns. AKA Clock Offset. Sometimes given as Part Per Billion (ppb) which is the same as ns. */
    clockbias?: number;
    /** The rate at which the local clock is drifting. In ns/s. */
    clockdrift?: number;
    /** Current datum. Hopefully WGS84. */
    datum?: string;
    /** Depth in meters. Probably depth below the keel. */
    depth?: number;
    /** Age of DGPS data. In seconds. */
    dgpsAge?: number;
    /** Station of DGPS data. */
    dgpsSta?: number;
    /** ECEF X position in meters. */
    ecefx?: number;
    /** ECEF Y position in meters. */
    ecefy?: number;
    /** ECEF Z position in meters. */
    ecefz?: number;
    /** ECEF position error in meters. Certainty unknown. */
    ecefpAcc?: number;
    /** ECEF X velocity in meters per second. */
    ecefvx?: number;
    /** ECEF Y velocity in meters per second. */
    ecefvy?: number;
    /** ECEF Z velocity in meters per second. */
    ecefvz?: number;
    /** ECEF velocity error in meters per second. Certainty unknown. */
    ecefvAcc?: number;
    /** Estimated climb error in meters per second. Certainty unknown. */
    epc?: number;
    /** Estimated course error in degrees. Certainty unknown. */
    epd?: number;
    /** Estimated horizontal Position (2D) Error in meters. Also known as Estimated Position Error (epe). Certainty unknown. */
    eph?: number;
    /** Estimated speed error in meters per second. Certainty unknown. */
    eps?: number;
    /** Estimated time stamp error in seconds. Certainty unknown. */
    ept?: number;
    /** Longitude error estimate in meters. Certainty unknown. */
    epx?: number;
    /** Latitude error estimate in meters. Certainty unknown. */
    epy?: number;
    /** Estimated vertical error in meters. Certainty unknown. */
    epv?: number;
    /** Estimated vertical velocity error in meters per second. Certainty unknown. */
    geoidSep?: number;
    /** Jamming Indicator: 0 (no jamming) to 255 (severe jamming). -1 means unset. */
    jam?: number;
    /** Latitude in degrees: +/- signifies North/South. */
    lat?: number;
    /** Current leap seconds. */
    leapseconds?: number;
    /** Longitude in degrees: +/- signifies East/West. */
    lon?: number;
    /** Course over ground, degrees magnetic. */
    magtrack?: number;
    /** Magnetic variation, degrees. Also known as the magnetic declination (the direction of the horizontal component of the magnetic field measured clockwise from north) in degrees, Positive is West variation. Negative is East variation. */
    magvar?: number;
    /** Down component of relative position vector in meters. */
    relD?: number;
    /** East component of relative position vector in meters. */
    relE?: number;
    /** North component of relative position vector in meters. */
    relN?: number;
    /** Estimated Spherical (3D) Position Error in meters. Guessed to be 95% confidence, but many GNSS receivers do not specify, so certainty unknown. */
    sep?: number;
    /** Speed over ground, meters per second. */
    speed?: number;
    /** GPS status: 0=Unknown, 1=Normal, 2=DGPS, 3=RTK Fixed, 4=RTK Floating, 5=DR, 6=GNSSDR, 7=Time (surveyed), 8=Simulated, 9=P(Y) */
    status?: GpsFixStatus;
    /** Receiver temperature in degrees Celsius. */
    temp?: number;
    /** Time/date stamp in ISO8601 format, UTC. May have a fractional part of up to .001sec precision. May be absent if the mode is not 2D or 3D. May be present, but invalid, if there is no fix. Verify 3 consecutive 3D fixes before believing it is UTC. Even then it may be off by several seconds until the current leap seconds is known. */
    time?: string;
    /** Course over ground, degrees from true north. */
    track?: number;
    /** Down velocity component in meters. */
    velD?: number;
    /** East velocity component in meters. */
    velE?: number;
    /** North velocity component in meters. */
    velN?: number;
    /** Wind direction in degrees. */
    wanglem?: number;
    /** Wind angle relative in degrees. */
    wangler?: number;
    /** Wind angle true in degrees. */
    wanglet?: number;
    /** Wind speed relative in meters per second. */
    wspeedr?: number;
    /** Wind speed true in meters per second. */
    wspeedt?: number;
    /** Water temperature in degrees Celsius. */
    wtemp?: number;
}

export default class UbloxReaderTpvPlugin extends UbloxReaderPlugin {
    readonly name = "tpv";

    protected collectedMessages: {
        [key in SentenceId]?: UbloxMessage;
    } = {};
    protected data: Partial<TpvPluginMessage> = {};

    setup(): void {
        this.device.on("message", this.handleMessage.bind(this));
    }

    protected handleMessage(message: UbloxMessage): void {
        const partial = this.fillDataFromMessage(message);
        if (partial) {
            this.emit(this.data);
        }
    }

    protected fillDataFromMessage(
        message: UbloxMessage
    ): Partial<TpvPluginMessage> | void {
        let prefix = "";
        let suffix: string;

        if (message instanceof UbloxPluginMessage) {
            prefix = `Plugin`;
            suffix = message.pluginName;
        } else {
            suffix = message.sentenceId;
        }
        // UC first letter of suffix
        suffix = suffix.charAt(0).toUpperCase() + suffix.slice(1).toLowerCase();
        // finds wether there is a method to handle the message
        const method = `updateWith${prefix}${suffix}` as keyof this;
        if (typeof this[method] === "function") {
            // call the method and update the data using the partial returned
            const partial = (
                this[method] as unknown as (
                    msg: object
                ) => Partial<TpvPluginMessage>
            )(message.data);
            this.updateData(partial);
            return partial;
        }
    }

    protected updateData(data: Partial<TpvPluginMessage>): void {
        Object.assign(this.data, data);
    }

    protected updateWithGbs(
        msg: UbloxGbsMessageData
    ): Partial<TpvPluginMessage> {
        return {
            time: msg.time.toISOString(),
            epx: msg.errLat,
            epy: msg.errLon,
            epv: msg.errAlt,
        };
    }

    protected updateWithGga(
        msg: UbloxGgaMessageData
    ): Partial<TpvPluginMessage> {
        if (msg.fixType !== FixType.gps) return {};
        return {
            time: msg.time.toISOString(),
            lat: parseFloat(msg.latitude),
            lon: parseFloat(msg.longitude),
            alt: msg.altitudeMeters,
            altMSL: msg.altitudeMeters + msg.geoidalSeparation,
            geoidSep: msg.geoidalSeparation,
            sep: msg.horizontalDilution,
        };
    }

    protected updateWithGll(
        msg: UbloxGllMessageData
    ): Partial<TpvPluginMessage> {
        if (msg.status !== "A") return {};
        return {
            time: msg.time.toISOString(),
            lat: parseFloat(msg.latitude),
            lon: parseFloat(msg.longitude),
        };
    }

    protected updateWithGns(
        msg: UbloxGnsMessageData
    ): Partial<TpvPluginMessage> {
        if (msg.fixType !== FixType.gps) return {};
        return {
            time: msg.time.toISOString(),
            lat: parseFloat(msg.latitude),
            lon: parseFloat(msg.longitude),
            alt: msg.altitudeMeters,
            altMSL: msg.altitudeMeters + msg.geoidalSeparation,
            geoidSep: msg.geoidalSeparation,
            sep: msg.horizontalDilution,
        };
    }

    // protected updateWithGrs(msg: UbloxGrsMessageData): Partial<TpvPluginMessage> {
    //     return {};
    // }

    // protected updateWithGsa(
    //     msg: UbloxGsaMessageData
    // ): Partial<TpvPluginMessage> {
    //     if (msg.selection !== "A") return {};
    //     return {
    //         mode: msg.mode,
    //     };
    // }

    protected updateWithGst(
        msg: UbloxGstMessageData
    ): Partial<TpvPluginMessage> {
        return {
            time: msg.time.toISOString(),
            epx: msg.latitudeError,
            epy: msg.longitudeError,
            epv: msg.altitudeError,
        };
    }

    // protected updateWithGsv(msg: UbloxGsvMessageData): Partial<TpvPluginMessage> {
    //     return {};
    // }

    protected updateWithRmc(
        msg: UbloxRmcMessageData
    ): Partial<TpvPluginMessage> {
        if (msg.status !== "A") return {};
        return {
            time: msg.datetime.toISOString(),
            lat: parseFloat(msg.latitude),
            lon: parseFloat(msg.longitude),
            speed: msg.speedKnots * 0.514444444,
            track: msg.trackTrue,
            magvar: msg.variation,
        };
    }

    // protected updateWithThs(msg: UbloxThsMessageData): Partial<TpvPluginMessage> {
    //     return {};
    // }

    // protected updateWithTxt(msg: UbloxTxtMessageData): Partial<TpvPluginMessage> {
    //     return {};
    // }

    protected updateWithTUbx00(
        msg: UbloxUbx00MessageData
    ): Partial<TpvPluginMessage> {
        // FIXME: This is a guess
        return {
            time: msg.utcTime.toISOString(),
            lat: msg.latitude,
            lon: msg.longitude,
            altHAE: msg.altRef,
            speed: msg.speedOverGround,
            track: msg.courseOverGround,
            climb: msg.vVelocity,
        };
    }

    // protected updateWithUbx04(msg: UbloxUbx03MessageData): Partial<TpvPluginMessage> {
    //     return {}
    // }

    // protected updateWithUbx04(
    //     msg: UbloxUbx04MessageData
    // ): Partial<TpvPluginMessage> {
    //     return {};
    // }

    // protected updateWithVlw(msg: UbloxVlwMessageData): Partial<TpvPluginMessage> {
    //     return {}
    // }

    protected updateWithVtg(
        msg: UbloxVtgMessageData
    ): Partial<TpvPluginMessage> {
        return {
            track: msg.trackTrue,
            speed: msg.speedKnots * 0.514444444,
        };
    }

    // protected updateWithZda(msg: UbloxZdaMessageData): Partial<TpvPluginMessage> {
    //     return {
    //         time: msg.datetime.toISOString(),
    //     };
    // }
}
